const SimpleNodeLogger = require('simple-node-logger');
const opts = {
    logFilePath: 'logfile.log',
    timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'
};

const log = SimpleNodeLogger.createSimpleLogger(opts);

module.exports = log;

/* logger.setLevel('debug');
logger.debug('this will be logged now');
logger.fatal('this will be fatal now');
logger.warn('this will be warn now'); */