using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Press3.UserDefinedClasses
{
    public static class AppConfig
    {
        private static string _connectionString = string.Empty;
        private static string _domainName = string.Empty;
        private static string _agentDialAnswerUrl = string.Empty;
        private static string _socketAddress = string.Empty;
        private static string _ycomDefaultAnswerUrl = string.Empty;
        
        public static string GetApplicationKey(string key) 
        {
            return (System.Configuration.ConfigurationManager.AppSettings[key] == null) ? string.Empty : System.Configuration.ConfigurationManager.AppSettings[key];
        }
        public static string ConnectionString
        {
            get
            { 
                if (_connectionString.Equals(string.Empty)) { _connectionString = GetApplicationKey("ConnectionString"); }
                return _connectionString;
            }
        }
        public static string YcomDefaultAnswerUrl
        {
            get
            {
                if (_ycomDefaultAnswerUrl.Equals(string.Empty)) { _ycomDefaultAnswerUrl = GetApplicationKey("YcomDefaultAnswerUrl"); }
                return _ycomDefaultAnswerUrl;
            }
        }
        public static string DomainName
        {
            get
            {
                if (_domainName.Equals(string.Empty))
                    _domainName = GetApplicationKey("DomainName");
                return _domainName;
            }
        }
        public static string AgentDialAnswerUrl
        {
            get
            {
                if (_agentDialAnswerUrl.Equals(string.Empty))
                    _agentDialAnswerUrl = GetApplicationKey("DialPlanAnswerUrl");
                return _agentDialAnswerUrl;
            }
        }
        public static string socketAddress
        {
            get
            {
                if (_socketAddress.Equals(string.Empty))
                    _socketAddress = GetApplicationKey("SocketAddress");
                return _socketAddress;
            }
        }
    }
}
