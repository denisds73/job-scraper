-- =============================================================================
-- JobScout Full-Text Search Setup (Neon Compatible)
-- =============================================================================
-- Simplified version that works with Neon's restrictions
-- =============================================================================

-- Enable trigram extension for fuzzy matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- =============================================================================
-- SEARCH INDEXES
-- =============================================================================

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

-- Function for autocomplete suggestions based on title
CREATE OR REPLACE FUNCTION suggest_job_titles(
  partial_query TEXT,
  result_limit INT DEFAULT 10
)
RETURNS TABLE (
  title TEXT,
  sim REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    j.title,
    similarity(j.title, partial_query) AS similarity_score
  FROM jobs j
  WHERE j.title % partial_query
  ORDER BY similarity_score DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- =============================================================================
-- STATISTICS
-- =============================================================================

-- Analyze tables for query optimization
ANALYZE jobs;
ANALYZE companies;
