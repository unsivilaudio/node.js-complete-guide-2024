import { Handler, serve } from 'https://deno.land/std/http/server.ts';

/**
 *  ### OLD SYNTAX
 *  ```
 *  const server = serve({ port: 3000 });
 *
 *  for await (const req of server){
 *      req.respond({ body: "Hello World\n"});
 *  }
 *  ```
 *  ### NEW SYNTAX
 *  ```
 *  const handler = (req, info) => new Response(...)
 *  serve(Handler, Options): Response
 *  ```
 *  [Deno.serve Documentation](https://deno.land/api@v1.42.1?s=Deno.serve)
 */
const requestHandler: Handler = (_req, _info): Promise<Response> | Response => {
    return new Response('Hello World\n', { status: 200 });
};

serve(requestHandler, { port: 3000 });
