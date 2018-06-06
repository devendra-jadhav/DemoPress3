using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Press3.UserDefinedClasses;
using Press3.Utilities;
using Newtonsoft.Json.Linq;
using UDC = Press3.UserDefinedClasses;
using System.Data;

namespace Press3.BusinessRulesLayer

{
public class CurlDialPlan
    {
     private FreeswitchDialPlanParameters DialPlanParameters;
     private Helper helper = new Helper();
        public CurlDialPlan(HttpContext context)
        {
            DialPlanParameters = new FreeswitchDialPlanParameters(context);
            
            this.OutBoundType(DialPlanParameters.CallerIdNumber,DialPlanParameters.CallerNetworkIp,DialPlanParameters.DestinationNumber);

            if(this.CallerId!=1){
                this.DialingNumberType(DialPlanParameters.DestinationNumber, this.AgentCountrycode.ToString());
                this.DestinationNumber = DialPlanParameters.DestinationNumber;
                this.IsAgentDial = DialPlanParameters.IsAgentDial;
                this.CurlCallEvent = DialPlanParameters.CallEvent;
                this.TransferFrom = DialPlanParameters.TransferFromNumber;
                this.TransferTo = DialPlanParameters.TransferToNumber;
                this.UserContext = DialPlanParameters.VarUserContext;                
                Logger.Info("generating dialplan for agent this is not callerid section transfer from:" + this.TransferFrom + ",Transfer to:" + this.TransferTo+",Destination Number:"+this.DestinationNumber);
            }
        }

        public CurlDialPlan()
        {

        }

        
    
       /*  public dynamic GetDialPlanXml(){
          string dialplanxml = string.Empty;
             
                try{

                    UDC.DialPlan dialPlanVariables = new UDC.DialPlan();

                    //outboundtypes
                    //1-internal
                    //2-national
                    //3-international
                    //4-no outbound

                    //internal
                    if(this.AgentOutBoundType==1 && this.DialNumberType ==1){
                        //agent able to make internal calls only no national and international
                        dialPlanVariables.Mode = 1;
                        dialPlanVariables.DestinationNumber = DialPlanParameters.DestinationNumber;
                        dialPlanVariables.ExtensionName = "Extension_internal_" + DialPlanParameters.CallerIdNumber;
                        dialPlanVariables.GatewayName = "user";
                        dialPlanVariables.UserContext = "public";
                        dialplanxml = GetDialplanXml(dialPlanVariables);
                        //dialplanxml = bridgeXml(DialPlanParameters.DestinationNumber,"Extension_internal_"+DialPlanParameters.CallerIdNumber,"user","public");
                    }
                    else if (this.AgentOutBoundType == 2 &&(this.DialNumberType ==1 || this.DialNumberType==2))
                    {   
                        //agent have national access so he can call to internal as wel national calls
                        dialPlanVariables.Mode = 1;
                        dialPlanVariables.DestinationNumber = DialPlanParameters.DestinationNumber;
                        dialPlanVariables.ExtensionName = "Extension_national_internal" + DialPlanParameters.CallerIdNumber;
                        dialPlanVariables.GatewayName = "user";
                        dialPlanVariables.UserContext = "public";
                        dialplanxml = GetDialplanXml(dialPlanVariables);
                        //dialplanxml = bridgeXml(DialPlanParameters.DestinationNumber, "Extension_national_internal" + DialPlanParameters.CallerIdNumber, "user", "public");

                    }else if (this.AgentOutBoundType ==3 && (this.DialNumberType==1 || this.DialNumberType==2 || this.DialNumberType ==3)){
                        //agent have international access so he can call to internal and national and international numbers
                        dialPlanVariables.Mode = 1;
                        dialPlanVariables.DestinationNumber = DialPlanParameters.DestinationNumber;
                        dialPlanVariables.ExtensionName = "Extension_international" + DialPlanParameters.CallerIdNumber;
                        dialPlanVariables.GatewayName = "user";
                        dialPlanVariables.UserContext = "public";
                        dialplanxml = GetDialplanXml(dialPlanVariables);
                        //dialplanxml = bridgeXml(DialPlanParameters.DestinationNumber, "Extension_international" + DialPlanParameters.CallerIdNumber, "user", "public");

                    }                                       
                    else{

                        if(this.AgentOutBoundType ==1 &&(this.DialNumberType == 2 || this.DialNumberType == 3)){
                            //agent have internal acces but he made national or international calls play that clip
                            dialPlanVariables.Mode = 2;
                            dialPlanVariables.DestinationNumber = DialPlanParameters.DestinationNumber;
                            dialPlanVariables.ExtensionName = "Extension_" + DialPlanParameters.DestinationNumber;
                            dialPlanVariables.UserContext = "public";
                            dialPlanVariables.PlayFile = "http://agent have internal acces but he made national or international calls play that clip.mp3";
                            dialplanxml = GetDialplanXml(dialPlanVariables);
                            //dialplanxml = noOutBOundXml("http://agent have internal acces but he made national or international calls play that clip.mp3", "public", "Extension_" + DialPlanParameters.DestinationNumber, DialPlanParameters.DestinationNumber);

                            
                        }else if(this.AgentOutBoundType ==2 &&(this.DialNumberType == 3)){
                            //agent have national acces but he made an international call
                            dialPlanVariables.Mode = 2;
                            dialPlanVariables.DestinationNumber = DialPlanParameters.DestinationNumber;
                            dialPlanVariables.ExtensionName = "Extension_" + DialPlanParameters.DestinationNumber;
                            dialPlanVariables.UserContext = "public";
                            dialPlanVariables.PlayFile = "http://agent have national acces but he made an international call.mp3";
                            dialplanxml = GetDialplanXml(dialPlanVariables);
                            //dialplanxml = noOutBOundXml("http://agent have national acces but he made an international call.mp3", "public", "Extension_" + DialPlanParameters.DestinationNumber, DialPlanParameters.DestinationNumber);
                        } 


                     //agent does not have any acces so we are playing a file
                        //String playFile,string userContext,string extensionName,string application,string destinationNumber
                       // dialplanxml = noOutBOundXml("play file",DialPlanParameters.VarUserContext,"Extension_"+DialPlanParameters.CallerIdNumber,"playback",DialPlanParameters.DestinationNumber);
                    }

                  }catch(Exception e){
                      Logger.Error("Exception while getting DialPlan Xml:"+e.ToString());
                  }

                return dialplanxml;
            }*/

         public string GetDialplanXml(UDC.DialPlan dialPlanVariableObj)
         {
            string responseXml = "";
            try
            {
                Press3.DataAccessLayer.SipPhoneRegistration sipObj = new Press3.DataAccessLayer.SipPhoneRegistration(AppConfig.ConnectionString);
                DataSet ds = new DataSet();
                ds = sipObj.GetDialplanXml(dialPlanVariableObj);
                if (ds != null)
                {
                    if (ds.Tables.Count > 0)
                    {
                        if (Convert.ToBoolean(ds.Tables[0].Rows[0]["Success"]))
                        {
                            responseXml = ds.Tables[0].Rows[0]["DialPlanXML"].ToString();
                        }
                    }
                }
                Logger.Info("Response xml in GetDialplanxml:" + responseXml);            

            }catch(Exception e){
                Logger.Error("Exception in GetDialPlanXml:"+e.ToString());
            }
             
            return responseXml;
        }
        /* public string bridgeXml(String destinationNumber, String extensionName, string gatewayname, string userContext)
         {
             //application - bridge

             String xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\r\n" +
                    "<document type=\"freeswitch/xml\">\r\n" +
                    "  <section name=\"dialplan\" description=\"RE Dial Plan For FreeSwitch\">\r\n" +
                    "    <context name=\"" + userContext + "\">\r\n" +
                    "      <extension name=\"" + extensionName + "\">\r\n" +
                    "        <condition field=\"destination_number\" expression=\"^" + destinationNumber + "$\">\r\n" +
                    "          <action application=\"bridge\" data=\"" + gatewayname + "/" + destinationNumber + "\"/>\r\n" +
                    "        </condition>\r\n" +
                    "      </extension>\r\n" +
                    "    </context>\r\n" +
                    "  </section>\r\n" +
                    "</document>\r\n";

             return xml;
         }*/


     public string ResponseXml()
     {
         string responsexml = string.Empty;
         //DialPlanParameters.DestinationNumber
         //DialPlanParameters.CallerIdNumber
         //this.AgentOutBoundType
         //DialPlanParameters.CallerIdName
         helper = new Helper();
         this.CallStatusId = 1;
         Press3.DataAccessLayer.SipPhoneRegistration SipPhoneRegister = new DataAccessLayer.SipPhoneRegistration(AppConfig.ConnectionString);
         var ds = SipPhoneRegister.GetResponseXml(DialPlanParameters.CallerIdNumber,DialPlanParameters.DestinationNumber,this.AgentOutBoundType,this.DialNumberType,DialPlanParameters.TransferFromNumber,DialPlanParameters.TransferToNumber);


          if (ds == null)
         {
             helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
             helper.CreateProperty(UDC.Label.SUCCESS, false);
         }
         else
         {
             helper.ParseDataSet(ds);
         }

         JObject ResponseJobj = helper.GetResponse();
         Logger.Info("Response Xml: response:"+ResponseJobj.ToString());

         if (ResponseJobj.SelectToken("Success").ToString() == "True")
         {
             responsexml = ResponseJobj.SelectToken("Message").ToString();
         }
         return responsexml;
     }

     public JObject UpdateDial(HttpParameters freeswitchparameters)
     {
         helper = new Helper();
         Press3.DataAccessLayer.SipPhoneRegistration SipPhoneRegister = new DataAccessLayer.SipPhoneRegistration(AppConfig.ConnectionString);
         var ds = SipPhoneRegister.UpdateDial(freeswitchparameters);


         if (ds == null)
         {
             helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
             helper.CreateProperty(UDC.Label.SUCCESS, false);
         }
         else
         {
             helper.ParseDataSet(ds);
         }

         JObject ResponseJobj = helper.GetResponse();
         Logger.Info("Response Xml: response:" + ResponseJobj.ToString());
         return ResponseJobj;
     }
   /*  public string noOutBOundXml(String playFile, string userContext, string extensionName, string destinationNumber)
     {
         String xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\r\n" +
                   "<document type=\"freeswitch/xml\">\r\n" +
                   "  <section name=\"dialplan\" description=\"RE Dial Plan For FreeSwitch\">\r\n" +
                   "    <context name=\"" + userContext + "\">\r\n" +
                   "      <extension name=\"" + extensionName + "\">\r\n" +
                   "        <condition field=\"destination_number\" expression=\"^" + destinationNumber + "$\">\r\n" +
                   "          <action application=\"playback\" data=\"" + playFile + "/>\r\n" +
                   "        </condition>\r\n" +
                   "      </extension>\r\n" +
                   "    </context>\r\n" +
                   "  </section>\r\n" +
                   "</document>\r\n";

         return xml;
     }*/


     //public string joinConference(String extensionName, string userContext,string DestinationNumber,string CallerIdNumber)
     //   {
     //       //application - Conference
     //       String xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\r\n" +
     //             "<document type=\"freeswitch/xml\">\r\n" +
     //             "  <section name=\"dialplan\" description=\"RE Dial Plan For FreeSwitch\">\r\n" +
     //             "    <context name=\"public\">\r\n" +
     //             "      <extension name=\"" + extensionName + "\">\r\n" +
     //             "        <condition field=\"destination_number\" expression=\"^" + DestinationNumber + "$\">\r\n" +
     //             "          <action application=\"answer\"/>\r\n" +
     //             "          <action application=\"conference\" data=\"" + CallerIdNumber + "_" + DestinationNumber + "\"/>\r\n" +
     //             "        </condition>\r\n" +
     //             "      </extension>\r\n" +
     //             "    </context>\r\n" +
     //             "  </section>\r\n" +
     //             "</document>\r\n";
     //       return xml;
     //   }


   /*  public string SocketXml(String extensionName, bool isInbound)
     {
         string ycom_answer_url = AppConfig.YcomDefaultAnswerUrl;
         string agentDialUrl = AppConfig.AgentDialAnswerUrl;
         string socketAddress = AppConfig.socketAddress;

         string xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\r\n" +
               "<document type=\"freeswitch/xml\">\r\n" +
               "  <section name=\"dialplan\" description=\"RE Dial Plan For FreeSwitch\">\r\n" +
               "    <context name=\"public\">\r\n" +
               "      <extension name=\"" + extensionName + "\">\r\n" +
               "        <condition field=\"destination_number\" expression=\"(.*)\">\r\n" +
               "          <action application=\"set\" data=\"ycom_answer_url=" + (isInbound == true ? ycom_answer_url : agentDialUrl).Trim() + "\"/>\r\n" +
             //     "          <action application=\"answer\"/>\r\n" +
               "          <action application=\"socket\" data=\"" + socketAddress + " async full\"/>\r\n" +
               "        </condition>\r\n" +
               "      </extension>\r\n" +
               "    </context>\r\n" +
               "  </section>\r\n" +
               "</document>\r\n";

         //<action application="socket" data="127.0.0.1:9090 async full"/>
         // <action application="set" data="ycom_answer_url=http://press3.demo.com/handlers/ClientCallerIdMetaData.ashx"/>

         return xml;
     }*/

     public  void OutBoundType(String FromNumber,String CallerIP,string tonumber)
        {

        //outboundtypes
        //1-internal
        //2-national
        //3-international
        //4-no outbound
         
         Press3.DataAccessLayer.SipPhoneRegistration SipPhoneRegister = new DataAccessLayer.SipPhoneRegistration(AppConfig.ConnectionString);
         var ds = SipPhoneRegister.GetAgentoutBoundType(FromNumber, CallerIP, tonumber);

         if (ds == null)
         {
             helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
             helper.CreateProperty(UDC.Label.SUCCESS, false);
         }
         else
         {
             helper.ParseDataSet(ds);
         }

         JObject outbounddetails = helper.GetResponse();
         Logger.Info("AgentOutboundType response:" + outbounddetails.ToString());         

         if (outbounddetails.SelectToken("Success").ToString() == "True")
         {
             JArray AgentOutBoundDetails = (JArray)outbounddetails.SelectToken("AgentOutboundDetails");

             if (AgentOutBoundDetails != null)
             {
                 if (AgentOutBoundDetails[0].SelectToken("OutboundType") != null)
                 {
                     this.AgentOutBoundType = Int32.Parse(AgentOutBoundDetails[0].SelectToken("OutboundType").ToString());
                     
                 }
                 if (AgentOutBoundDetails[0].SelectToken("CountryCode") != null)
                 {
                     
                     this.AgentCountrycode = Int32.Parse(AgentOutBoundDetails[0].SelectToken("CountryCode").ToString());
                 }
                 if (AgentOutBoundDetails[0].SelectToken("CallerId") != null)
                 {

                     this.CallerId = Int32.Parse(AgentOutBoundDetails[0].SelectToken("CallerId").ToString());
                     this.DestinationNumber = DialPlanParameters.DestinationNumber;                     

                 }

             }
             else
             {
                 Logger.Info("Dial plan requested but no agent details found requested from number.");
             }


         } 
         else
         {
             this.IsAgentDial = true;
             Logger.Info("No data Returned from database so no agent typ and no callertype un authorised.");
         }

        }


     public string UpdateOutboundCalls(HttpParameters restparameters)
     {

         string updateResponse = string.Empty;

         Press3.DataAccessLayer.SipPhoneRegistration SipPhoneRegister = new DataAccessLayer.SipPhoneRegistration(AppConfig.ConnectionString);
         var ds = SipPhoneRegister.UpdateOutboundCalls(restparameters);



         helper = new Helper();
         if (ds == null)
         {
             helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
             helper.CreateProperty(UDC.Label.SUCCESS, false);
         }
         else
         {
             helper.ParseDataSet(ds);
         }
         JObject updateOutBoundDetails = helper.GetResponse();
         Logger.Info("Updating hangup for agent outbound calls"+updateOutBoundDetails.ToString());

         if (updateOutBoundDetails.SelectToken("Success").ToString() == "True")
         {
           //  JArray AgentOutBoundDetails = (JArray)outbounddetails.SelectToken("AgentOutboundDetails");

             if(updateOutBoundDetails.SelectToken("Message") != null){
                 updateResponse = updateOutBoundDetails.SelectToken("Message").ToString();
             }

         }
         else
         {
             Logger.Info("No data Returned from database so no agent typ and no callertype un authorised.");
         }

         return updateResponse;

     }

     public void DialingNumberType(String ToNumber,string agentCountryCode)
     {
         int dialNumberType = 0;
         //outboundtypes
         //1-internal
         //2-national
         //3-international
         //4-no outbound

         string tempTonumber = string.Empty;         

         if(!ToNumber.StartsWith(agentCountryCode) && !ToNumber.StartsWith("00")){
             //internal
             dialNumberType = 1;
         }
         else if(ToNumber.StartsWith(agentCountryCode)){
             //national
             dialNumberType = 2;
         }else if(ToNumber.StartsWith("00") && !ToNumber.Substring(2,ToNumber.Length-2).StartsWith(agentCountryCode)){
             //international
             dialNumberType = 3;
         }
         this.DialNumberType = dialNumberType;         
     }

     #region "properties"
     public int AgentOutBoundType { get; set; }
     public int DialNumberType { get; set; }
     public int AgentCountrycode { get; set; }
     public int CallerId { get; set; }

     public int CallStatusId { get; set; }
     public bool IsAgentDial { get; set; }
     public string CurlCallEvent { get; set; }
     public string DestinationNumber { get; set; }
     public string UserContext { get; set; }

     public string TransferFrom { get; set; }
     public string TransferTo { get; set; }
     #endregion


    }
  

}

