using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Press3.UserDefinedClasses
{
    public class FreeSwitchRegisterParameters
    {

        public FreeSwitchRegisterParameters(HttpContext context)
        {
            if (context.Request.HttpMethod.ToString().ToUpper() == "POST")
            {
                HostName = string.IsNullOrEmpty(context.Request.Form["hostname"]) == false ? context.Request.Form["hostname"] : "";
                Section = string.IsNullOrEmpty(context.Request.Form["section"]) == false ? context.Request.Form["section"] : "";
                TagName = string.IsNullOrEmpty(context.Request.Form["tag_name"]) == false ? context.Request.Form["tag_name"] : "";
                KeyName = string.IsNullOrEmpty(context.Request.Form["key_name"]) == false ? context.Request.Form["key_name"] : "";
                KeyValue = string.IsNullOrEmpty(context.Request.Form["key_value"]) == false ? context.Request.Form["key_value"] : "";
                EventName = string.IsNullOrEmpty(context.Request.Form["Event-Name"]) == false ? context.Request.Form["Event-Name"] : "";
                CoreUUID = string.IsNullOrEmpty(context.Request.Form["Core-UUID"]) == false ? context.Request.Form["Core-UUID"] : "";
                FreeSwitchHostName = string.IsNullOrEmpty(context.Request.Form["FreeSWITCH-Hostname"]) == false ? context.Request.Form["FreeSWITCH-Hostname"].ToString() : "";
                FreeSwitchSwitchName = string.IsNullOrEmpty(context.Request.Form["FreeSWITCH-Switchname"]) == false ? context.Request.Form["FreeSWITCH-Switchname"].ToString() : "";
                FreeSwitchIPV4 = string.IsNullOrEmpty(context.Request.Form["FreeSWITCH-IPv4"]) == false ? context.Request.Form["FreeSWITCH-IPv4"].ToString() : "";
                FreeSwitchIPV6 = string.IsNullOrEmpty(context.Request.Form["FreeSWITCH-IPv6"]) == false ? context.Request.Form["FreeSWITCH-IPv6"].ToString() : "";
                EventDateTime = string.IsNullOrEmpty(context.Request.Form["Event-Date-Timestamp"]) == false ? context.Request.Form["Event-Date-Timestamp"].ToString() : "";
                RegisterUser = string.IsNullOrEmpty(context.Request.Form["user"]) == false ? context.Request.Form["user"].ToString() : "";
                RegisterDomain = string.IsNullOrEmpty(context.Request.Form["domain"]) == false ? context.Request.Form["domain"].ToString() : "";
                Action = string.IsNullOrEmpty(context.Request.Form["action"]) == false ? DecodeString(context.Request.Form["action"]) : "";
                SipUserAgent = string.IsNullOrEmpty(context.Request.Form["sip_user_agent"]) == false ? context.Request.Form["sip_user_agent"] : "";
                SipContactHost = string.IsNullOrEmpty(context.Request.Form["sip_contact_host"]) == false ? context.Request.Form["sip_contact_host"] : "";
                SipToPort = string.IsNullOrEmpty(context.Request.Form["sip_to_port"]) == false ? context.Request.Form["sip_to_port"] : "";
                SipFromPort = string.IsNullOrEmpty(context.Request.Form["sip_from_port"]) == false ? context.Request.Form["sip_from_port"] : "";
                SipUserPort =string.IsNullOrEmpty(context.Request.Form["client_port"]) == false ? context.Request.Form["client_port"] : "0";
                SipUserIp = string.IsNullOrEmpty(context.Request.Form["sip_contact_host"]) == false ? context.Request.Form["sip_contact_host"] : "";
                SipRequestIp = string.IsNullOrEmpty(context.Request.Form["sip_request_host"]) == false ? context.Request.Form["sip_request_host"] : "";
                SipRequestPort = string.IsNullOrEmpty(context.Request.Form["sip_request_port"]) == false ? context.Request.Form["sip_request_port"] : "";
                EventCallingFile = string.IsNullOrEmpty(context.Request.Form["Event-Calling-File"]) == false ? context.Request.Form["Event-Calling-File"] : "";
         }
            else
            {
                IsSofia = string.IsNullOrEmpty(context.Request.QueryString["isSofia"]) == false ? true : false;
                ProfileName = string.IsNullOrEmpty(context.Request.QueryString["smscresponse[profilename]"]) == false ? context.Request.QueryString["smscresponse[profilename]"] : "";
                SofiaCoreUUID = string.IsNullOrEmpty(context.Request.QueryString["smscresponse[calluid]"]) == false ? context.Request.QueryString["smscresponse[calluid]"] : "";
                Expires = string.IsNullOrEmpty(context.Request.QueryString["smscresponse[expires]"]) == false ? context.Request.QueryString["smscresponse[expires]"] : "";
                ToUser = string.IsNullOrEmpty(context.Request.QueryString["smscresponse[touser]"]) == false ? context.Request.QueryString["smscresponse[touser]"] : "";
                NetworkIp = string.IsNullOrEmpty(context.Request.QueryString["smscresponse[networkip]"]) == false ? context.Request.QueryString["smscresponse[networkip]"] : "";
                SipUserAgent = string.IsNullOrEmpty(context.Request.QueryString["smscresponse[useragent]"]) == false ? context.Request.QueryString["smscresponse[useragent]"] : "";
                SipUserPort = string.IsNullOrEmpty(context.Request.QueryString["smscresponse[port]"]) == false ? context.Request.QueryString["smscresponse[port]"] : "";
                FromUser = string.IsNullOrEmpty(context.Request.QueryString["smscresponse[fromuser]"]) == false ? context.Request.QueryString["smscresponse[fromuser]"] : "";
                EventDateTime = HttpUtility.UrlDecode(string.IsNullOrEmpty(context.Request.QueryString["smscresponse[eventtimestamp]"]) == false ? context.Request.QueryString["smscresponse[eventtimestamp]"] : "");
                Contact = HttpUtility.UrlDecode(string.IsNullOrEmpty(context.Request.QueryString["smscresponse[contact]"]) == false ? context.Request.QueryString["smscresponse[contact]"] : "");
                RegistrationStatus = string.IsNullOrEmpty(context.Request.QueryString["smscresponse[status]"]) == false ? context.Request.QueryString["smscresponse[status]"] : "";
                UserName = string.IsNullOrEmpty(context.Request.QueryString["smscresponse[username]"]) == false ? context.Request.QueryString["smscresponse[username]"] : "";
                SipFromPort = string.IsNullOrEmpty(context.Request.Form["sip_from_port"]) == false ? context.Request.Form["sip_from_port"] : "";
                SipContactHost = string.IsNullOrEmpty(context.Request.Form["sip_contact_host"]) == false ? context.Request.Form["sip_contact_host"] : "";
                    
            }

        }
        #region "properties"
        public string HostName { get; set; }
        public string Section { get; set; }
        public string TagName { get; set; }
        public string KeyName { get; set; }
        public string KeyValue { get; set; }
        public string EventName { get; set; }
        public string CoreUUID { get; set; }
        public string FreeSwitchHostName { get; set; }
        public string FreeSwitchSwitchName { get; set; }
        public string FreeSwitchIPV4 { get; set; }
        public string FreeSwitchIPV6 { get; set; }
        public string EventDateTime { get; set; }
        public string EventCallingFile { get; set; }
        public string RegisterUser { get; set; }
        public string RegisterDomain { get; set; }

        public string Action { get; set; }
        public string SipUserAgent { get; set; }

        public string SipUserPort { get; set; }

        public string SipRequestPort { get; set; }

        public string SipRequestIp { get; set; }
        public string SipUserIp { get; set; }

        public string SipContactHost { get; set; } // user registerd IP
        public string SipToPort { get; set; }
        public string SipFromPort { get; set; }

        //String coreUuid="",eventDate="",profileName="",fromUser="",
        //contact="",status="",expires="",touser="",networkip="",username="",useragent="";

    
        public string RegisterTime { get; set; }
        public string ProfileName { get; set; }
        public string FromUser { get; set; }
        public string Contact { get; set; }
        public string Statuc { get; set; }
        public string Expires { get; set; }
        public string ToUser { get; set; }
        public string NetworkIp { get; set; }
        public  string UserName { get; set; }
        public Boolean IsSofia { get; set; }
        public string SofiaCoreUUID { get; set; }

        public string RegistrationStatus { get; set; }


        #endregion
        public String DecodeString(String encodedString)
        {
            encodedString = HttpUtility.UrlDecode(encodedString);
            return encodedString;
        }
    }

   public class FreeswitchDialPlanParameters 
    {
        public FreeswitchDialPlanParameters(HttpContext context)
        {

            try
            {
                string path = HttpContext.Current.Server.MapPath("~/FreeSwitchRequest/") + System.DateTime.Now.ToString("yyyyMMddHHmmss");
                HttpContext.Current.Request.SaveAs(path + ".txt",true);                
            }catch(Exception e){
                e.StackTrace.ToString();
            }

            if (context.Request.HttpMethod == "POST")
            {
                this.Section = context.Request["section"];
                this.CoreUuid = context.Request["Core-UUID"];
                this.VarSipUserAgent = context.Request["variable_sip_user_agent"];
                this.CallerIdName = context.Request["Caller-Caller-ID-Name"];
                this.CallerIdNumber = context.Request["Caller-Caller-ID-Number"];
                this.DestinationNumber = context.Request["Caller-Destination-Number"];
                this.VarSipToUser = context.Request["variable_sip_to_user"];
                this.VarEffectiveCallerIdNumber = context.Request["variable_effective_caller_id_number"];
                this.VarEffectiveCallerIdName = context.Request["variable_effective_caller_id_name"];
                this.VarUserContext = context.Request["variable_user_context"];
                this.CallerNetworkIp = context.Request["Caller-Network-Addr"];
                this.TransferFromNumber = context.Request["variable_sip_h_Referred-By"];
                this.TransferToNumber = context.Request["variable_sip_refer_to"];
                if(this.VarUserContext == null){
                    this.VarUserContext = context.Request["Caller-Context"];
                }



                //variable_sip_h_Referred-By=<sip:888@192.168.1.201:5066>
                //variable_sip_refer_to=<sip:889@192.168.1.201:5066>


                //variable_effective_caller_id_name
                //Core-UUID
                //variable_sip_user_agent
                //Caller-Caller-ID-Name
                //Caller-Caller-ID-Number
                //variable_sip_to_user
                //Caller-Destination-Number
                //variable_effective_caller_id_number
                //variable_effective_caller_id_name
                //variable_user_context

            }
            else
            {
                this.SequenceNumber = string.IsNullOrEmpty(context.Request.QueryString["sequencenumber"]) == false ? Convert.ToInt32(context.Request.QueryString["smscresponse[sequencenumber]"]) : 0;
                this.IsAgentDial = string.IsNullOrEmpty(context.Request.QueryString["isAgentDial"]) == false ? true : false;
                this.CallerIdNumber = string.IsNullOrEmpty(context.Request.QueryString["smscresponse[from]"]) == false ? context.Request.QueryString["smscresponse[from]"] : "";
                this.DestinationNumber = HttpContext.Current.Server.UrlDecode(string.IsNullOrEmpty(context.Request.QueryString["smscresponse[to]"]) == false ? context.Request.QueryString["smscresponse[to]"] : "").Replace("+","").Trim();
                this.CoreUuid = string.IsNullOrEmpty(context.Request.QueryString["smscresponse[calluid]"]) == false ? context.Request.QueryString["smscresponse[calluid]"] : "";
                this.DialStartTime = string.IsNullOrEmpty(context.Request.QueryString["smscresponse[starttime]"]) == false ? Convert.ToInt32(context.Request.QueryString["smscresponse[starttime]"]) : 0;
                this.DialEndTime = string.IsNullOrEmpty(context.Request.QueryString["smscresponse[endtime]"]) == false ?  Convert.ToInt32(context.Request.QueryString["smscresponse[endtime]"]) : 0;
                this.EventTime = string.IsNullOrEmpty(context.Request.QueryString["smscresponse[eventtime]"]) == false ? HttpContext.Current.Server.UrlDecode(context.Request.QueryString["smscresponse[eventtime]"]) : "";
                this.DialALegUUID = string.IsNullOrEmpty(context.Request.QueryString["smscresponse[DialALegUUID]"]) == false ? context.Request.QueryString["smscresponse[DialALegUUID]"] : "";
                this.DialBLegUUID = string.IsNullOrEmpty(context.Request.QueryString["smscresponse[DialBLegUUID]"]) == false ? context.Request.QueryString["smscresponse[DialBLegUUID]"] : "";
                this.CallStatus = string.IsNullOrEmpty(context.Request.QueryString["smscresponse[callstatus]"]) == false ? context.Request.QueryString["smscresponse[callstatus]"] : "";
                this.Event = string.IsNullOrEmpty(context.Request.QueryString["smscresponse[event]"]) == false ? context.Request.QueryString["smscresponse[event]"] : "";
                this.CallEvent = string.IsNullOrEmpty(context.Request.QueryString["smscresponse[event]"]) == false ? context.Request.QueryString["smscresponse[event]"] : "";
                this.CallerNetworkIp = "0.0.0.0";
            }
        }

        #region "properties"

        public string Section { get; set; }
        public int SequenceNumber { get; set; }
        public string Event { get; set; }
        public string CallStatus { get; set; }
        public string CoreUuid { get; set; }
        public long DialStartTime { get; set; }
        public long DialEndTime { get; set; }
        public string EventTime { get; set; }
        public string DialALegUUID { get; set; }
        public string DialBLegUUID { get; set; }
        public string VarSipUserAgent { get; set; }
        public string CallerIdName { get; set; }
        public string CallerIdNumber { get; set; }
        public string DestinationNumber { get; set; }

        public string VarSipToUser { get; set; }
        public string VarEffectiveCallerIdNumber { get; set; }
        public string VarEffectiveCallerIdName { get; set; }
        public string VarUserContext { get; set; }

        public Boolean IsAgentDial { get; set; }
        public string CallerNetworkIp { get; set; }
        public  string TransferFromNumber { get; set; }
        public  string TransferToNumber { get; set; }
        public string CallEvent { get; set; }



        #endregion
    }


   public class ReadRestParameters
   {


       public ReadRestParameters(HttpContext context)
       {

        if (context.Request.HttpMethod == "GET"){
            this.Ringlength = string.IsNullOrEmpty(context.Request.QueryString["smscresponse[ringlength]"]) == false ? context.Request.QueryString["smscresponse[ringlength]"] : null;
            this.HangupDisposition = string.IsNullOrEmpty(context.Request.QueryString["smscresponse[hangupdisposition]"]) == false ? context.Request.QueryString["smscresponse[hangupdisposition]"] : "";
            this.CallUid = string.IsNullOrEmpty(context.Request.QueryString["smscresponse[calluid]"]) == false ? context.Request.QueryString["smscresponse[calluid]"] : "";
            this.EndTime = string.IsNullOrEmpty(context.Request.QueryString["smscresponse[endtime]"]) == false ? context.Request.QueryString["smscresponse[endtime]"] : "";
            this.EndReason = string.IsNullOrEmpty(context.Request.QueryString["smscresponse[endreason]"]) == false ? context.Request.QueryString["smscresponse[endreason]"] : "";
            this.StartTime = string.IsNullOrEmpty(context.Request.QueryString["smscresponse[starttime]"]) == false ? context.Request.QueryString["smscresponse[starttime]"] : "";
            this.SequenceNumber = string.IsNullOrEmpty(context.Request.QueryString["smscresponse[sequencenumber]"]) == false ? context.Request.QueryString["smscresponse[sequencenumber]"] : "";
            this.CallStatus = string.IsNullOrEmpty(context.Request.QueryString["smscresponse[callstatus]"]) == false ? context.Request.QueryString["smscresponse[callstatus]"] : "";
            this.RingStartTime = string.IsNullOrEmpty(context.Request.QueryString["smscresponse[ringstarttime]"]) == false ? context.Request.QueryString["smscresponse[ringstarttime]"] : "";
            this.BilledMillSec = string.IsNullOrEmpty(context.Request.QueryString["smscresponse[billmsec]"]) == false ? context.Request.QueryString["smscresponse[billmsec]"] : "";
            this.FromNumber = string.IsNullOrEmpty(context.Request.QueryString["smscresponse[from]"]) == false ? context.Request.QueryString["smscresponse[from]"] : "";
            this.ToNumber = string.IsNullOrEmpty(context.Request.QueryString["smscresponse[to]"]) == false ? context.Request.QueryString["smscresponse[to]"] : "";
            this.CallEvent = string.IsNullOrEmpty(context.Request.QueryString["smscresponse[event]"]) == false ? context.Request.QueryString["smscresponse[event]"] : "";
            this.Digits = string.IsNullOrEmpty(context.Request.QueryString["smscresponse[digits]"]) == false ? context.Request.QueryString["smscresponse[digits]"] : "";
            this.EventTimeStamp = string.IsNullOrEmpty(context.Request.QueryString["smscresponse[eventtimestamp]"]) == false ? context.Request.QueryString["smscresponse[eventtime]"] : "";
        }
        else
        {
            this.Ringlength = string.IsNullOrEmpty(context.Request["smscresponse[ringlength]"]) == false ? context.Request["smscresponse[ringlength]"] : null;
            this.HangupDisposition = string.IsNullOrEmpty(context.Request["smscresponse[hangupdisposition]"]) == false ? context.Request["smscresponse[hangupdisposition]"] : "";
            this.CallUid = string.IsNullOrEmpty(context.Request["smscresponse[calluid]"]) == false ? context.Request["smscresponse[calluid]"] : "";
            this.EndTime = string.IsNullOrEmpty(context.Request["smscresponse[endtime]"]) == false ? context.Request["smscresponse[endtime]"] : "";
            this.EndReason = string.IsNullOrEmpty(context.Request["smscresponse[endreason]"]) == false ? context.Request["smscresponse[endreason]"] : "";
            this.StartTime = string.IsNullOrEmpty(context.Request["smscresponse[starttime]"]) == false ? context.Request["smscresponse[starttime]"] : "";
            this.SequenceNumber = string.IsNullOrEmpty(context.Request["smscresponse[sequencenumber]"]) == false ? context.Request["smscresponse[sequencenumber]"] : "";
            this.CallStatus = string.IsNullOrEmpty(context.Request["smscresponse[callstatus]"]) == false ? context.Request["smscresponse[callstatus]"] : "";
            this.RingStartTime = string.IsNullOrEmpty(context.Request["smscresponse[ringstarttime]"]) == false ? context.Request["smscresponse[ringstarttime]"] : "";
            this.BilledMillSec = string.IsNullOrEmpty(context.Request["smscresponse[billmsec]"]) == false ? context.Request["smscresponse[billmsec]"] : "";
            this.FromNumber = string.IsNullOrEmpty(context.Request["smscresponse[from]"]) == false ? context.Request["smscresponse[from]"] : "";
            this.ToNumber = string.IsNullOrEmpty(context.Request["smscresponse[to]"]) == false ? context.Request["smscresponse[to]"] : "";
            this.CallEvent = string.IsNullOrEmpty(context.Request["smscresponse[event]"]) == false ? context.Request["smscresponse[event]"] : "";
            this.Digits = string.IsNullOrEmpty(context.Request["smscresponse[digits]"]) == false ? context.Request["smscresponse[digits]"] : "";
            this.EventTimeStamp = string.IsNullOrEmpty(context.Request["smscresponse[eventtimestamp]"]) == false ? context.Request["smscresponse[eventtime]"] : "";
        }

       }



       /*
        * smscresponse[ringlength]=9
smscresponse[hangupdisposition]=send_bye
smscresponse[calluid]=a989a576-a423-11e7-8218-636a74b337c8
smscresponse[endtime]=1506585887
smscresponse[endreason]=NORMAL_CLEARING
smscresponse[starttime]=1506585883
smscresponse[sequencenumber]=1513410
smscresponse[Source]=null
smscresponse[PDD]=1
smscresponse[callstatus]=completed
smscresponse[ringstarttime]=1506585874
smscresponse[billmsec]=4100
smscresponse[endreasonq850]=16;null
smscresponse[from]=9966
smscresponse[to]=1014
smscresponse[event]=hangup
smscresponse[direction]=inbound
        */

       #region "properties"

       public string Ringlength { get; set; }
       public string HangupDisposition { get; set; }
       public string CallUid { get; set; }
       public string EndTime { get; set; }
       public string EndReason { get; set; }
       public string StartTime { get; set; }
       public string SequenceNumber { get; set; }
       public string CallStatus { get; set; }
       public string RingStartTime { get; set; }
       public string BilledMillSec { get; set; }
       public string FromNumber { get; set; }
       public string ToNumber { get; set; }
       public string CallEvent { get; set; }

       public string Digits { get; set; }
       public string EventTimeStamp { get; set; }

       #endregion
   }




}
