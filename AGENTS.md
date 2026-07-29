<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Backend Response integration

the backend always responds with three main objects, which are status (determines if the operation was successful on the server or not), message (which contains the response message of the operation on the server), and data (contains the data returned from the server or empty), sometimes it returns error field in cases of forms, where there can be inline errors for each field, the keys in the error fields would always match the field name in the form, inside data, there would be a an object that holds the actual data content, for example for a list of notifications, you would have data: { notifications: [...] }
