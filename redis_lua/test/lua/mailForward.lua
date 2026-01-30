function mailForward(KEYS, ARGS)
	-- flags no-writes
	local hset = KEYS[1]
	local key = ARGS[1]
	local val = redis.call("HGET", hset, key)
	if not val then
		val = redis.call("HGET", hset, "*")
	end
	return val
end

function mailForwardSet(KEYS, ARGS)
	-- flags no-writes
	local hset = KEYS[1]

	if #ARGS == 0 then
		return {}
	end

	local values = redis.call("HMGET", hset, unpack(ARGS))

	local default_val = nil
	local seen = {}
	local result = {}

	for _, mail in ipairs(values) do
		if not mail then
			if default_val == nil then
				local db_val = redis.call("HGET", hset, "*")
				if db_val then
					default_val = db_val
				else
					default_val = ""
				end
			end
			mail = default_val
		end

		if mail and mail ~= "" then
			if not seen[mail] then
				seen[mail] = true
				table.insert(result, mail)
			end
		end
	end

	return result
end
