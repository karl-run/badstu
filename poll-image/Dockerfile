FROM denoland/deno:2.3.6

WORKDIR /app

ADD . .
RUN deno cache main.ts

CMD ["run", "--allow-net", "main.ts"]
