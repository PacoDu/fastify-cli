const t = require('tap')
const test = t.test
const parseArgs = require('../args')

test('should parse args correctly', t => {
  t.plan(1)

  const argv = [
    '--port', '7777',
    '--address', 'fastify.io:9999',
    '--socket', 'fastify.io.socket:9999',
    '--log-level', 'info',
    '--pretty-logs', 'true',
    '--print-routes', 'true',
    '--watch', 'true',
    '--ignore-watch', 'ignoreme.js',
    '--options', 'true',
    '--prefix', 'FASTIFY_',
    '--plugin-timeout', '500',
    '--body-limit', '5242880',
    'app.js'
  ]
  const parsedArgs = parseArgs(argv)

  t.strictDeepEqual(parsedArgs, {
    _: ['app.js'],
    prettyLogs: true,
    printRoutes: true,
    options: true,
    watch: true,
    ignoreWatch: 'ignoreme.js',
    port: 7777,
    address: 'fastify.io:9999',
    socket: 'fastify.io.socket:9999',
    logLevel: 'info',
    prefix: 'FASTIFY_',
    pluginTimeout: 500,
    bodyLimit: 5242880
  })
})

test('should parse args with = assignment correctly', t => {
  t.plan(1)

  const argv = [
    '--port=7777',
    '--address=fastify.io:9999',
    '--socket=fastify.io.socket:9999',
    '--log-level=info',
    '--pretty-logs=true',
    '--print-routes=true',
    '--watch=true',
    '--ignore-watch=ignoreme.js',
    '--options=true',
    '--prefix=FASTIFY_',
    '--plugin-timeout=500',
    '--body-limit=5242880',
    'app.js'
  ]
  const parsedArgs = parseArgs(argv)

  t.strictDeepEqual(parsedArgs, {
    _: ['app.js'],
    prettyLogs: true,
    printRoutes: true,
    options: true,
    watch: true,
    ignoreWatch: 'ignoreme.js',
    port: 7777,
    address: 'fastify.io:9999',
    socket: 'fastify.io.socket:9999',
    logLevel: 'info',
    prefix: 'FASTIFY_',
    pluginTimeout: 500,
    bodyLimit: 5242880
  })
})

test('should parse env vars correctly', t => {
  t.plan(1)

  process.env.FASTIFY_PORT = '7777'
  process.env.FASTIFY_ADDRESS = 'fastify.io:9999'
  process.env.FASTIFY_SOCKET = 'fastify.io.socket:9999'
  process.env.FASTIFY_LOG_LEVEL = 'info'
  process.env.FASTIFY_PRETTY_LOGS = 'true'
  process.env.FASTIFY_PRINT_ROUTES = 'true'
  process.env.FASTIFY_WATCH = 'true'
  process.env.FASTIFY_IGNORE_WATCH = 'ignoreme.js'
  process.env.FASTIFY_OPTIONS = 'true'
  process.env.FASTIFY_PREFIX = 'FASTIFY_'
  process.env.FASTIFY_BODY_LIMIT = '5242880'
  process.env.FASTIFY_PLUGIN_TIMEOUT = '500'

  t.teardown(function () {
    delete process.env.FASTIFY_PORT
    delete process.env.FASTIFY_ADDRESS
    delete process.env.FASTIFY_SOCKET
    delete process.env.FASTIFY_LOG_LEVEL
    delete process.env.FASTIFY_PRETTY_LOGS
    delete process.env.FASTIFY_PRINT_ROUTES
    delete process.env.FASTIFY_WATCH
    delete process.env.FASTIFY_IGNORE_WATCH
    delete process.env.FASTIFY_OPTIONS
    delete process.env.FASTIFY_PREFIX
    delete process.env.FASTIFY_BODY_LIMIT
    delete process.env.FASTIFY_PLUGIN_TIMEOUT
  })

  const parsedArgs = parseArgs([])

  t.strictDeepEqual(parsedArgs, {
    _: [],
    prettyLogs: true,
    printRoutes: true,
    options: true,
    watch: true,
    ignoreWatch: 'ignoreme.js',
    address: 'fastify.io:9999',
    bodyLimit: 5242880,
    logLevel: 'info',
    port: 7777,
    prefix: 'FASTIFY_',
    socket: 'fastify.io.socket:9999',
    pluginTimeout: 500
  })
})

test('should respect default values', t => {
  t.plan(7)

  const argv = [
    'app.js'
  ]

  const parsedArgs = parseArgs(argv)

  t.is(parsedArgs._[0], 'app.js')
  t.is(parsedArgs.options, false)
  t.is(parsedArgs.prettyLogs, false)
  t.is(parsedArgs.watch, false)
  t.is(parsedArgs.ignoreWatch, 'node_modules build dist .git bower_components logs')
  t.is(parsedArgs.logLevel, 'fatal')
  t.is(parsedArgs.pluginTimeout, 10000)
})
