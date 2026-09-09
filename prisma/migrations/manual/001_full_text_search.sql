-- =============================================================================
-- JobScout Full-Text Search Setup
-- =============================================================================
-- This migration adds PostgreSQL full-text search capabilities to the jobs table.
-- Run after the initial Prisma migration.
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- =============================================================================
-- SEARCH CONFIGURATION
-- =============================================================================
-- Create a custom text search configuration that removes accents

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_ts_config WHERE cfgname = 'jobscout_english'
  ) THEN
    CREATE TEXT SEARCH CONFIGURATION jobscout_english (COPY = english);
    ALTER TEXT SEARCH CONFIGURATION jobscout_english
      ALTER MAPPING FOR hword, hword_part, word
      WITH unaccent, english_stem;
  END IF;
END $$;

-- =============================================================================
-- FULL-TEXT SEARCH VECTOR COLUMN
-- =============================================================================
-- Add a generated tsvector column for efficient full-text search
-- Weights: A (title) > B (skills) > C (description)

ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS search_vector tsvector
GENERATED ALWAYS AS (
  setweight(to_tsvector('jobscout_english', COALESCE(title, '')), 'A') ||
  setweight(to_tsvector('jobscout_english', COALESCE(array_to_string(skills, ' '), '')), 'B') ||
  setweight(to_tsvector('jobscout_english', COALESCE(description, '')), 'C')
) STORED;

-- =============================================================================
-- SEARCH INDEXES
-- =============================================================================

-- GIN index for full-text search (primary search mechanism)
CREATE INDEX IF NOT EXISTS idx_jobs_search_vector 
ON jobs USING GIN (search_vector);

-- Trigram index for fuzzy matching on title
CREATE INDEX IF NOT EXISTS idx_jobs_title_trgm 
ON jobs USING GIN (title gin_trgm_ops);

-- Trigram index for location fuzzy matching
CREATE INDEX IF NOT EXISTS idx_jobs_location_trgm 
ON jobs USING GIN (location gin_trgm_ops);

-- Trigram index for company name fuzzy matching
CREATE INDEX IF NOT EXISTS idx_companies_name_trgm 
ON companies USING GIN (name gin_trgm_ops);

-- =============================================================================
-- HELPER FUNCTIONS
-- =============================================================================

-- Function to search jobs with ranking
CREATE OR REPLACE FUNCTION search_jobs(
  search_query TEXT,
  result_limit INT DEFAULT 20,
  result_offset INT DEFAULT 0
)
RETURNS TABLE (
  job_id TEXT,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    j.id::TEXT,
    ts_rank_cd(j.search_vector, websearch_to_tsquery('jobscout_english', search_query)) AS rank
  FROM jobs j
  WHERE j.search_vector @@ websearch_to_tsquery('jobscout_english', search_query)
  ORDER BY rank DESC, j.posted_at DESC
  LIMIT result_limit
  OFFSET result_offset;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function for autocomplete suggestions based on title
CREATE OR REPLACE FUNCTION suggest_job_titles(
  partial_query TEXT,
  result_limit INT DEFAULT 10
)
RETURNS TABLE (
  title TEXT,
  similarity REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    j.title,
    similarity(j.title, partial_query) AS sim
  FROM jobs j
  WHERE j.title % partial_query
  ORDER BY sim DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- =============================================================================
-- STATISTICS
-- =============================================================================

-- Analyze tables for query optimization
ANALYZE jobs;
ANALYZE companies;
