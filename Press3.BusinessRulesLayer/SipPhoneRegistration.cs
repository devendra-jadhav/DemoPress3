using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Press3.DataAccessLayer;
using Press3.Utilities;
using Newtonsoft.Json.Linq;
using System.Data;
using Press3.UserDefinedClasses;
using UDC = Press3.UserDefinedClasses;

namespace Press3.BusinessRulesLayer
{
    public class SipPhoneRegistration
    {
        private Helper helper = null;
        public SipPhoneRegistration()
        {
            helper = new Helper();
            helper.ResponseFormat = "json";
            helper.InitializeResponseVariables();
        }
        public JObject GetSipPhoneDetails(string connectionString,string number, string domain,string userPort,string userIp,string requestPort,string requestIp,string eventCallingFile)
        {
            try
            {
                Press3.DataAccessLayer.SipPhoneRegistration sip = new Press3.DataAccessLayer.SipPhoneRegistration(connectionString);
                DataSet ds = sip.GetPassword(number, domain,userPort,userIp,requestPort,requestIp,eventCallingFile);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }

            }catch(Exception ex){
                helper.CreateProperty(UDC.Label.MESSAGE, ex.ToString());
                helper.CreateProperty(UDC.Label.SUCCESS, false);
                Logger.Error(ex.ToString());
            }

            return helper.GetResponse();
          // return sip.GetPassword(number, domain);
        }


        public JObject RegisterAndUnRegister(string connectionString,Press3.UserDefinedClasses.FreeSwitchRegisterParameters requestParams)
        {
            try
            {
                Press3.DataAccessLayer.SipPhoneRegistration sip = new Press3.DataAccessLayer.SipPhoneRegistration(connectionString);
                var ds = sip.RegisterAndUnRegisterSoftPhone(requestParams);
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
                helper.CreateProperty(UDC.Label.MESSAGE, ex.ToString());
                helper.CreateProperty(UDC.Label.SUCCESS, false);
                Logger.Error("Exception in register and Business:"+ ex.ToString());
            }

            return helper.GetResponse();
            // return sip.GetPassword(number, domain);
        }

    }
}
