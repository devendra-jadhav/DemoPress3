using System;
using System.Data;
using UDC = Press3.UserDefinedClasses;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using Press3.Utilities;

namespace Press3.BusinessRulesLayer
{
    public class ConfigInfo
    {
        private Helper helper = null;
        public ConfigInfo()
        {
            helper = new Helper();
            helper.ResponseFormat = "json";
            helper.InitializeResponseVariables();
        }

        public JObject GetConfigInfo(String connection, int AgentId, int AccountId)
        {
            try
            {
                Press3.DataAccessLayer.ConfigInfo configObject = new Press3.DataAccessLayer.ConfigInfo(connection);
                DataSet ds = configObject.GetConfigInfo(AgentId, AccountId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                helper.CreateProperty("RetMessage", ex.ToString());
                Logger.Error("Exception In AgentLogout " + ex.ToString());
            }
            return helper.GetResponse();
        }

    }
}
