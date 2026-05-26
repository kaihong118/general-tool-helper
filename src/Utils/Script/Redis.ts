/**
 * [command] - redis-cli TYPE "api-pmp-agent_CustomerPasswordBlacklist_eu39+3@18m.dev_count"
 * Check how Redis is storing the data:
 */

/**
 * [command] - redis-cli LRANGE "api-pmp-agent_CustomerPasswordBlacklist_eu39+3@18m.dev_count" 0 -1
 * 0: Specifies the starting index (the very first item).
 * -1: Specifies the ending index (the very last item).
 */

/**
 * [command] - redis-cli --scan
 * If you just want a complete index of every single key name in the database
 */
