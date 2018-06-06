using System;
using log4net;

namespace Press3.Utilities
{
    public class Logger
    {
        private static ILog _defaultLogger = null;
        private static ILog _traceLogger = null;
        private static ILog _debugLogger = null;
        public static void Initialize()
        {
            log4net.GlobalContext.Properties["LogName"] = DateTime.Now.ToString("yyyyMMdd");
            log4net.Config.XmlConfigurator.Configure();
            _defaultLogger = log4net.LogManager.GetLogger("DefaultLogger");
            _traceLogger = log4net.LogManager.GetLogger("TraceLogger");
            _debugLogger = log4net.LogManager.GetLogger("DEBUG");
        }
        public static void Info(object input, bool isTrace = false)
        {
            if (isTrace)
            {
                _traceLogger.Info(input);
            }
            else
            {
                _defaultLogger.Info(input);
            }
        }
        public static void Debug(object input, bool isTrace = false)
        {
            if (isTrace)
            {
                _traceLogger.Debug(input);
            }
            else
            {
                _defaultLogger.Debug(input);
            }
        }
        public static void Error(object input, bool isTrace = false)
        {
            if (isTrace)
            {
                _traceLogger.Error(input);
            }
            else
            {
                _defaultLogger.Error(input);
            }
        }
        public static void Warn(object input, bool isTrace = false)
        {
            if (isTrace)
            {
                _traceLogger.Warn(input);
            }
            else
            {
                _defaultLogger.Warn(input);
            }
        }
        public static void Fatal(object input, bool isTrace = false)
        {
            if (isTrace)
            {
                _traceLogger.Fatal(input);
            }
            else
            {
                _defaultLogger.Fatal(input);
            }
        }
    }
}
