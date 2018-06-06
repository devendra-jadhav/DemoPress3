using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Press3.UserDefinedClasses;
using Press3.BusinessRulesLayer;
using Press3.UI.CommonClasses;
using Newtonsoft.Json.Linq;
using Press3.Utilities;
using System.Text.RegularExpressions;
using System.IO;
namespace Press3.UI.Handlers
{
    /// <summary>
    /// Summary description for SoftPhoneRegister
    /// </summary>
    public class SoftPhoneRegister : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            String xml = string.Empty;
            string usernameRegularExpression = "^[a-zA-Z0-9]+$";
            Regex usernameRegex = new Regex("^[0-9]+$", RegexOptions.Compiled);






            try
            {

                string isSave = AppConfig.GetApplicationKey("SaveFreeSwitchRequest");
                if (isSave == "1")
                {
                    if (!Directory.Exists(HttpContext.Current.Server.MapPath("~/FreeSwitchRequest/")))
                    {
                        Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/FreeSwitchRequest/"));
                        Logger.Info("Freeswitch requsts directory created in softphone register .");
                    }


                    string path = HttpContext.Current.Server.MapPath("~/FreeSwitchRequest/") + System.DateTime.Now.ToString("yyyyMMddHHmmss");
                    HttpContext.Current.Request.SaveAs(path + ".txt", true);
                    Logger.Debug("Freeswitch softphone register Request is saved in " + path);
                }



                Press3.UserDefinedClasses.FreeSwitchRegisterParameters requestParameter = new FreeSwitchRegisterParameters(context);


                if(requestParameter.IsSofia){
                   xml = RegisterAndUnregisterSip(MyConfig.MyConnectionString, requestParameter);
                }
                else if (requestParameter.RegisterUser != null || requestParameter.RegisterDomain != null)
                {
//                    Logger.Info("Registered user: "+requestParameter.RegisterUser.ToString());
                        if(usernameRegex.IsMatch(requestParameter.RegisterUser)){

                            this.Password = GetSipPhonePassword(MyConfig.MyConnectionString, requestParameter.RegisterUser, requestParameter.RegisterDomain,requestParameter.SipUserPort,requestParameter.SipUserIp,requestParameter.SipRequestPort,requestParameter.SipRequestIp,requestParameter.EventCallingFile);
                        }
                        else
                        {
  //                          Logger.Info("Registered user in else: " + requestParameter.RegisterUser.ToString());
                            this.Message = "<Response>username contains invalid characters</Response>";
                        }

                    
                    if (!string.IsNullOrEmpty(Password) && Password != "0")
                    {
                        xml = FrameRegiterUserXml(requestParameter.RegisterUser, requestParameter.RegisterDomain, this.Password);
                    }
                    else
                    {
                        xml = this.Message;
                    }
                    
                }else {
                    xml = "<Response>Mandatatry parameters are missing</Response>";
                }


                //if(!requestParameter.IsSofia)
               // Logger.Info("SoftPhone Xml generated the user:" + requestParameter.RegisterUser + ",Event Name:" + requestParameter.EventName + ",\nXml:" + xml.Replace("\n", "").Replace("\r", ""));
                SendXmlResponse(context, xml);
            }catch(Exception ex){
                Logger.Error("Exception while processing request:" + ex.ToString());
            }
        }
        public string FrameRegiterUserXml(string user, string domain, string password)
        {
            string vertoUserXml = string.Empty;
            //string softPhoneXML = string.Empty;
            //softPhoneXML = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\r\n" +
            //     "<document type=\"freeswitch/xml\">\r\n" +
            //     "  <section name=\"directory\">\r\n" +
            //     "    <domain name=\"" + domain + "\">\r\n" +
            //     "    <params>\r\n" +
            //     "      <param name=\"dial-string\" value=\"{presence_id=${dialed_user}@${dialed_domain}}${sofia_contact(${dialed_user}@${dialed_domain})}\"/>\r\n" +
            //     "    </params>\r\n" +
            //     "      <groups>\r\n" +
            //     "      <group name=\"default\">\r\n" +
            //     "      <users>\r\n" +
            //     "      <user id = \"" + user + "\">\r\n" +
            //     "    <params>\r\n" +
            //     "    <param name= \"password\" value = \"" + password + "\"/>\r\n" +
            //     "    </params>\r\n" +
            //     "      </user>\r\n" +
            //     "      </users>\r\n" +
            //     "      </group>\r\n" +
            //     "      </groups>\r\n" +
            //     "      </domain>\r\n" +
            //     "  </section>\r\n" +
            //     "</document>\r\n";

          //string  vertoUserXml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\r\n" +
          //          "<include>\r\n" +
          //          "     <user id = \"" + user + "\">\r\n" +
          //          "		<params>\r\n" +
          //          "    		<param name= \"password\" value = \"" + password + "\"/>\r\n" +
          //          "			<param name=\"vm-password\" value=\"" + password + "\"/>\r\n" +
          //          "			<param name=\"verto-context\" value=\"public\"/>\r\n" +
          //          "			<param name=\"verto-dialplan\" value=\"XML\"/>\r\n" +
          //          "		</params>\r\n" +
          //          "	</user>\r\n" +
          //          "</include>";

            try
            {
                vertoUserXml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\r\n" +
                 "<document type=\"freeswitch/xml\">\r\n" +
                 "  <section name=\"directory\">\r\n" +
                 "<include>\r\n" +
                 "    <domain name=\"" + domain + "\">\r\n" +
                 "    <params>\r\n" +
                 "    		<param name= \"jsonrpc-allowed-methods\" value = \"verto\"/>\r\n" +
                 "    		<param name= \"jsonrpc-allowed-event-channels\" value = \"demo,conference,presence\"/>\r\n" +
                 "    </params>\r\n" +
                 "     <user id = \"" + user + "\">\r\n" +
                 "		<params>\r\n" +
                    "      <param name=\"dial-string\" value=\"{presence_id=${dialed_user}@${dialed_domain}}${sofia_contact(${dialed_user}@${dialed_domain})}\"/>\r\n" +
                 "    		<param name= \"password\" value = \"" + password + "\"/>\r\n" +
                 "			<param name=\"vm-password\" value=\"" + password + "\"/>\r\n" +
                 "			<param name=\"verto-context\" value=\"public\"/>\r\n" +
                 "			<param name=\"verto-dialplan\" value=\"XML\"/>\r\n" +
                 "		</params>\r\n" +
                 "	</user>\r\n" +
                 "      </domain>\r\n" +
                 "</include>\r\n" +
                 "  </section>\r\n" +
                 "</document>\r\n";  
            }catch(Exception ex){
                Logger.Error("Exception while framing verto xml for user:"+user+", with domain:"+domain+",Password:"+password+",Exception:"+ ex.ToString());
            }
         
            return vertoUserXml;
            
        }

      /*  public string generateSofiaXml(string user, string ip, string password)
        {
            try 
            {
                String userXML = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\r\n" +
                    "<document type=\"freeswitch/xml\">\r\n" +
                    "  <section name=\"directory\">\r\n" +
                    "<include>\r\n" +
                    "    <domain name=\"" + ip + "\">\r\n" +
                    "    <params>\r\n" +
                    "    		<param name= \"jsonrpc-allowed-methods\" value = \"verto\"/>\r\n" +
                    "    		<param name= \"jsonrpc-allowed-event-channels\" value = \"demo,conference,presence\"/>\r\n" +
                    "    </params>\r\n" +
                    "     <user id = \"" + user + "\">\r\n" +
                    "		<params>\r\n" +
                       "      <param name=\"dial-string\" value=\"{presence_id=${dialed_user}@${dialed_domain}}${sofia_contact(${dialed_user}@${dialed_domain})}\"/>\r\n" +
                    "    		<param name= \"password\" value = \"" + password + "\"/>\r\n" +
                    "			<param name=\"vm-password\" value=\"" + password + "\"/>\r\n" +
                    "			<param name=\"verto-context\" value=\"public\"/>\r\n" +
                    "			<param name=\"verto-dialplan\" value=\"XML\"/>\r\n" +
                    "		</params>\r\n" +
                    "	</user>\r\n" +
                    "      </domain>\r\n" +
                    "</include>\r\n" +
                    "  </section>\r\n" +
                    "</document>\r\n";     
            }catch(Exception ex){
                Logger.Error("Exception while generating sofia user xml: with user:"+user+",Exception:"+ex.ToString());
            }

        }*/

        public void SendXmlResponse(HttpContext context, String xmlresponse)
        {
            context.Response.ContentType = "text/xml";
            context.Response.Write(xmlresponse);
            
        }


        public dynamic GetGetOutBoundType(String FromNumber,String CallerIP)
        {
            var AgentDetails="";

            return AgentDetails;
        }


        public string GetSipPhonePassword(string connectionString,string number, string domain,string userPort,string UserIp,string requestPort,string requestIp,string eventCallingFile)
        {
            string password = String.Empty;
            Press3.BusinessRulesLayer.SipPhoneRegistration sips = new Press3.BusinessRulesLayer.SipPhoneRegistration();
            JObject passworddetails = sips.GetSipPhoneDetails(connectionString, number, domain,userPort,UserIp,requestPort,requestIp,eventCallingFile);
           try
           {
               if (passworddetails.SelectToken("Success").ToString() == "True")
               {
                   JArray softPhoneDetails = (JArray)passworddetails.SelectToken("SipPhoneDetails");

                   if (softPhoneDetails != null)
                   {
                       if (softPhoneDetails[0].SelectToken("PASSWORD") != null)
                       {
                           password = softPhoneDetails[0].SelectToken("PASSWORD").ToString();
                       }
                   }
                   else
                   {
                       this.Message = passworddetails.SelectToken("Message").ToString();
                   }

               }
               else
               {
                   password = "0";
                   this.Message = passworddetails.SelectToken("Message").ToString();
               }
           }catch(Exception ex){
               Logger.Error("Exception while Fetching Password for verto user:" + number + ", with domain:" + domain + ",Exception:" + ex.ToString());
           }       

           
           return password;
        }

        public string  RegisterAndUnregisterSip(string connectionString, FreeSwitchRegisterParameters requestParams)
        {
            string status = String.Empty;
            try
            {
                Press3.BusinessRulesLayer.SipPhoneRegistration sips = new Press3.BusinessRulesLayer.SipPhoneRegistration();
                JObject registrationdetails = sips.RegisterAndUnRegister(connectionString, requestParams);                    
                this.Message = registrationdetails.SelectToken("Message").ToString();                

            }catch(Exception ex){
                Logger.Error("Exception while unregistering sip user:" + ex.ToString());              
            }
           
            
            return this.Message;
        }



        
        #region "properties"
        public string Password { get; set; }
        public string Message { get; set; }
        #endregion

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}