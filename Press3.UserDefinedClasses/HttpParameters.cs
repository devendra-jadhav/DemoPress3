using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Press3.Utilities;

namespace Press3.UserDefinedClasses
{
    public class HttpParameters
    {
        public string Event { get; set; }
        public string CallStatus { get; set; }
        public string CallUUid { get; set; }
        public string Digits { get; set; }
        public string FromNumber { get; set; }
        public string ToNumber { get; set; }
        public bool IsOutBound { get; set; }
        public string EndReason { get; set; }
        public string HangupDisposition { get; set; }
        public Int32 StartTime { get; set; }
        public Int32 EndTime { get; set; }
        public Int32 RingTIme { get; set; }
        public string RequestUuid { get; set; }
        public string RecordUrl { get; set; }
        public Int32 SequenceNumber { get; set; }

        public string DialALegUUID { get; set; }
        public string DialBLegUUID { get; set; }
        public string DialBLegStatus { get; set; }
        public string ConferenceProfile { get; set; }
        public string ConferenceName { get; set; }
        public string ConferenceAction { get; set; }
        public Int32 ConferenceSize { get; set; }

        public string ConferenceUUID { get; set; }
        public Int32 ConferenceMemberID { get; set; }

        public Int64 Eventtimestamp { get; set; }
        public string TalkingAgentRequestUUID { get; set; }
        public bool IsTransferToAgent { get; set; }
        public string GatewayUrl { get; set; }
        public bool IsWarmTransfer { get; set; }
        public Int32 CallerFsMemberId { get; set; }
        public Int32 CallerSequenceNumber { get; set; }
        public bool IsCaller { get; set; }
        public bool IsAgent { get; set; }
        public Int32 CallBackRequestAgentId { get; set; }
        public bool IsCallBackRequetCall { get; set; }
        public string CallBackRequestClip { get; set; }
        public bool IsVertoPhone { get; set; }
        public string ChannelName { get; set; }
        public string IpPhoneTransferedMemberId { get; set; }
        public bool IsRingUrl { get; set; }
        public string EventTime { get; set; }
        public Int64 BillMillSec { get; set; }

        public string ConfDigits { get; set; }
        public bool IsAgentDial { get; set; }
        public int InitTime { get; set; }
        public string Callee { get; set; }
        public string Caller { get; set; }
        public void ParseParameters(HttpContext context)
        {


            if (context.Request.HttpMethod.ToString().Equals("GET"))
            {

                if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.CALL_BACK_REQUEST_AGENT_ID]) == false)
                {
                    this.CallBackRequestAgentId = Convert.ToInt32(context.Request.QueryString[HttpGetParametersLabels.CALL_BACK_REQUEST_AGENT_ID]);
                }
                else
                {
                    this.CallBackRequestAgentId = 0;
                };
                if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.INIT_TIME]) == false)
                {
                    this.InitTime = Convert.ToInt32(context.Request.QueryString[HttpGetParametersLabels.INIT_TIME]);
                }
                else
                {
                    this.InitTime = 0;
                };
                if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.IS_VERTO_PHONE]) == false)
                {
                    this.IsVertoPhone = Convert.ToBoolean(context.Request.QueryString[HttpGetParametersLabels.IS_VERTO_PHONE]);
                }
                else
                {
                    this.IsVertoPhone = false;
                };
                if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.CALL_BACK_REQUEST_CLIP]) == false)
                {
                    this.CallBackRequestClip = context.Request.QueryString[HttpGetParametersLabels.CALL_BACK_REQUEST_CLIP];
                }
                else
                {
                    this.CallBackRequestClip = "";
                };
                if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.IS_CALLBACK_REQUEST_CALL]) == false)
                {
                    this.IsCallBackRequetCall = Convert.ToBoolean(context.Request.QueryString[HttpGetParametersLabels.IS_CALLBACK_REQUEST_CALL]);
                }
                else
                {
                    this.IsCallBackRequetCall = false;
                };
                if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.CALLUUID]) == false)
                {
                    this.CallUUid = context.Request.QueryString[HttpGetParametersLabels.CALLUUID];
                }
                else
                {
                    this.CallUUid = "";
                };
                if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.TO_NUMBER]) == false)
                {
                    this.ToNumber = context.Request.QueryString[HttpGetParametersLabels.TO_NUMBER].ToString();
                }
                else
                {
                    this.ToNumber = "";
                };
                if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.EVENT_TIME_STAMP]) == false)
                {
                    this.Eventtimestamp = Convert.ToInt64(context.Request.QueryString[HttpGetParametersLabels.EVENT_TIME_STAMP]);
                }
                else
                {
                    this.Eventtimestamp = 0;
                };
                if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.EVENT]) == false)
                {
                    this.Event = context.Request.QueryString[HttpGetParametersLabels.EVENT];
                }
                else
                {
                    this.Event = "";
                };

                if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.EVENT_TIME]) == false)
                {
                    this.EventTime = HttpUtility.UrlDecode(context.Request.QueryString[HttpGetParametersLabels.EVENT_TIME]);
                }
                else
                {
                    this.EventTime = "";
                };

                if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.FROM_NUMBER]) == false)
                {
                    this.FromNumber = context.Request.QueryString[HttpGetParametersLabels.FROM_NUMBER];
                }
                else
                {
                    this.FromNumber = "";
                };
                if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.IS_OUTBOUND]) == false)
                {
                    if (context.Request.QueryString[HttpGetParametersLabels.IS_OUTBOUND].ToString() == "inbound")
                    {
                        this.IsOutBound = false;
                    }
                    else
                    {
                        this.IsOutBound = true;
                    }
                }
                else
                {
                    this.IsOutBound = true;
                };
                if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.CALL_STATUS]) == false)
                {
                    this.CallStatus = context.Request.QueryString[HttpGetParametersLabels.CALL_STATUS];
                }
                else
                {
                    this.CallStatus = "";
                };
                if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.DIGITS]) == false)
                {
                    this.Digits = context.Request.QueryString[HttpGetParametersLabels.DIGITS];
                }
                else
                {
                    this.Digits = "";
                };

                if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.START_TIME]) == false)
                {
                    this.StartTime = Convert.ToInt32(context.Request.QueryString[HttpGetParametersLabels.START_TIME].ToString());
                }
                else
                {
                    this.StartTime = 0;
                };
                if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.END_TIME]) == false)
                {
                    this.EndTime = Convert.ToInt32(context.Request.QueryString[HttpGetParametersLabels.END_TIME].ToString());
                }
                else
                {
                    this.EndTime = 0;
                };

                if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.REQUEST_UUID]) == false)
                {
                    this.RequestUuid = context.Request.QueryString[HttpGetParametersLabels.REQUEST_UUID];
                }
                else
                {
                    this.RequestUuid = "";
                };
                if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.END_REASON]) == false)
                {
                    this.EndReason = context.Request.QueryString[HttpGetParametersLabels.END_REASON];
                }
                else
                {
                    this.EndReason = "";
                };
                if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.RING_TIME]) == false)
                {
                    this.RingTIme = Convert.ToInt32(context.Request.QueryString[HttpGetParametersLabels.RING_TIME].ToString());
                }
                else
                {
                    this.RingTIme = 0;
                };

                if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.RING_START_TIME]) == false)
                {
                    this.RingTIme = Convert.ToInt32(context.Request.QueryString[HttpGetParametersLabels.RING_START_TIME].ToString());
                }
                else
                {
                    this.RingTIme = 0;
                };

                if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.HANGUP_DISPOSITION]) == false)
                {
                    this.HangupDisposition = context.Request.QueryString[HttpGetParametersLabels.HANGUP_DISPOSITION].ToString();
                }
                else
                {
                    this.HangupDisposition = "";
                };
                if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.SEQUENC_ENUMBER]) == false)
                {
                    this.SequenceNumber = Convert.ToInt32(context.Request.QueryString[HttpGetParametersLabels.SEQUENC_ENUMBER].ToString());
                }
                else
                {
                    this.SequenceNumber = 0;
                };
                if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.DIAL_B_LEG_UUID]) == false)
                {
                    this.DialBLegUUID = context.Request.QueryString[HttpGetParametersLabels.DIAL_B_LEG_UUID];
                }
                else
                {
                    this.DialBLegUUID = "";
                };
                if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.DIAL_B_LEG_STATUS]) == false)
                {
                    this.DialBLegStatus = context.Request.QueryString[HttpGetParametersLabels.DIAL_B_LEG_STATUS];
                }
                else
                {
                    this.DialBLegStatus = "";
                };
                if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.DIAL_A_LEG_UUID]) == false)
                {
                    this.DialALegUUID = context.Request.QueryString[HttpGetParametersLabels.DIAL_A_LEG_UUID];
                }
                else
                {
                    this.DialALegUUID = "";
                };
                if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.RECORD_URL]) == false)
                {
                    this.RecordUrl = context.Request.QueryString[HttpGetParametersLabels.RECORD_URL];
                }
                else
                {
                    this.RecordUrl = "";
                };
                if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.RECORD_URL]) == false)
                {
                    this.RecordUrl = context.Request.QueryString[HttpGetParametersLabels.RECORD_URL];
                }
                else
                {
                    this.RecordUrl = "";
                };
                if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.CALLEE]) == false)
                {
                    this.Callee = context.Request.QueryString[HttpGetParametersLabels.CALLEE];
                }
                else
                {
                    this.Callee = "";
                };
                if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.CALLER]) == false)
                {
                    this.Caller = context.Request.QueryString[HttpGetParametersLabels.CALLER];
                }
                else
                {
                    this.Caller = "";
                };
            }
            else
            {
                string jsonStr = "";
                JObject jsonObj = default(JObject);
                StreamReader inputStream = null;
                JObject jsonObjParaMeters = default(JObject);
                context.Request.InputStream.Position = 0;
                inputStream = new StreamReader(context.Request.InputStream);
                jsonStr = HttpUtility.UrlDecode(inputStream.ReadToEnd());
                jsonObj = new JObject();

                if (!String.IsNullOrEmpty(jsonStr))
                {
                    jsonObj = JObject.Parse(jsonStr);

                    jsonObjParaMeters = JObject.Parse(jsonObj.SelectToken("smscresponse").ToString());
                    if (jsonObjParaMeters.SelectToken(HttpPostParametersLabels.IS_VERTO_PHONE) != null)
                    {
                        this.IsVertoPhone = Convert.ToBoolean(jsonObjParaMeters.SelectToken(HttpPostParametersLabels.IS_VERTO_PHONE).ToString());
                    }
                    else
                    {
                        this.IsVertoPhone = false;
                    }
                    if (jsonObjParaMeters.SelectToken(HttpPostParametersLabels.IS_CALLBACK_REQUEST_CALL) != null)
                    {
                        this.IsCallBackRequetCall = Convert.ToBoolean(jsonObjParaMeters.SelectToken(HttpPostParametersLabels.IS_CALLBACK_REQUEST_CALL).ToString());
                    }
                    else
                    {
                        this.IsCallBackRequetCall = false;
                    }
                    if (jsonObjParaMeters.SelectToken(HttpPostParametersLabels.CALL_BACK_REQUEST_AGENT_ID) != null)
                    {
                        this.CallBackRequestAgentId = Convert.ToInt32(jsonObjParaMeters.SelectToken(HttpPostParametersLabels.CALL_BACK_REQUEST_AGENT_ID).ToString());
                    }
                    else
                    {
                        this.CallBackRequestAgentId = 0;
                    }
                    if (jsonObjParaMeters.SelectToken(HttpPostParametersLabels.INIT_TIME) != null)
                    {
                        this.InitTime = Convert.ToInt32(jsonObjParaMeters.SelectToken(HttpPostParametersLabels.INIT_TIME).ToString());
                    }
                    else
                    {
                        this.CallBackRequestAgentId = 0;
                    }
                    if (jsonObjParaMeters.SelectToken(HttpPostParametersLabels.CALL_BACK_REQUEST_CLIP) != null)
                    {
                        this.CallBackRequestClip = jsonObjParaMeters.SelectToken(HttpPostParametersLabels.CALL_BACK_REQUEST_CLIP).ToString();
                    }
                    else
                    {
                        this.CallBackRequestClip = "";
                    }
                    if (jsonObjParaMeters.SelectToken(HttpPostParametersLabels.CALLUUID) != null)
                    {
                        this.CallUUid = jsonObjParaMeters.SelectToken(HttpPostParametersLabels.CALLUUID).ToString();
                    }
                    else
                    {
                        this.CallUUid = "";
                    }
                    if (jsonObjParaMeters.SelectToken(HttpPostParametersLabels.TO_NUMBER) != null)
                    {
                        this.ToNumber = jsonObjParaMeters.SelectToken(HttpPostParametersLabels.TO_NUMBER).ToString();
                    }
                    else
                    {
                        this.ToNumber = "";
                    }
                    if (jsonObjParaMeters.SelectToken(HttpPostParametersLabels.FROM_NUMBER) != null)
                    {
                        this.FromNumber = jsonObjParaMeters.SelectToken(HttpPostParametersLabels.FROM_NUMBER).ToString();
                    }
                    else
                    {
                        this.FromNumber = "";
                    }
                    if (jsonObjParaMeters.SelectToken(HttpPostParametersLabels.EVENT) != null)
                    {
                        this.Event = jsonObjParaMeters.SelectToken(HttpPostParametersLabels.EVENT).ToString();
                    }
                    else
                    {
                        this.Event = "";
                    }
                    if (jsonObjParaMeters.SelectToken(HttpPostParametersLabels.EVENT_TIME_STAMP) != null)
                    {
                        this.Eventtimestamp = Convert.ToInt64(jsonObjParaMeters.SelectToken(HttpPostParametersLabels.EVENT_TIME_STAMP).ToString());
                    }
                    else
                    {
                        this.Eventtimestamp = 0;
                    }
                    if (jsonObjParaMeters.SelectToken(HttpPostParametersLabels.EVENT_TIME) != null)
                    {
                        this.EventTime = HttpUtility.UrlDecode(jsonObjParaMeters.SelectToken(HttpPostParametersLabels.EVENT_TIME).ToString());
                    }
                    else
                    {
                        this.EventTime = "";
                    }
                    if (jsonObjParaMeters.SelectToken(HttpPostParametersLabels.IS_OUTBOUND) != null)
                    {
                        if (jsonObjParaMeters.SelectToken(HttpPostParametersLabels.IS_OUTBOUND).ToString() == "inbound")
                        {
                            this.IsOutBound = false;
                        }
                        else
                        {
                            this.IsOutBound = true;
                        }

                    }
                    else
                    {
                        this.IsOutBound = true;
                    }
                    if (jsonObjParaMeters.SelectToken(HttpPostParametersLabels.CALL_STATUS) != null)
                    {
                        this.CallStatus = jsonObjParaMeters.SelectToken(HttpPostParametersLabels.CALL_STATUS).ToString();
                    }
                    else
                    {
                        this.CallStatus = "";
                    }
                    if (jsonObjParaMeters.SelectToken(HttpPostParametersLabels.DIGITS) != null)
                    {
                        this.Digits = jsonObjParaMeters.SelectToken(HttpPostParametersLabels.DIGITS).ToString();
                    }
                    else
                    {
                        this.Digits = "";
                    }
                    if (jsonObjParaMeters.SelectToken(HttpPostParametersLabels.END_REASON) != null)
                    {
                        this.EndReason = jsonObjParaMeters.SelectToken(HttpPostParametersLabels.END_REASON).ToString();
                    }
                    else
                    {
                        this.EndReason = "";
                    }
                    if (jsonObjParaMeters.SelectToken(HttpPostParametersLabels.START_TIME) != null)
                    {
                        this.StartTime = Convert.ToInt32(jsonObjParaMeters.SelectToken(HttpPostParametersLabels.START_TIME).ToString());
                    }
                    else
                    {
                        this.StartTime = 0;
                    }
                    if (jsonObjParaMeters.SelectToken(HttpPostParametersLabels.END_TIME) != null)
                    {
                        this.EndTime = Convert.ToInt32(jsonObjParaMeters.SelectToken(HttpPostParametersLabels.END_TIME).ToString());
                    }
                    else
                    {
                        this.EndTime = 0;
                    }
                    if (jsonObjParaMeters.SelectToken(HttpPostParametersLabels.RING_TIME) != null)
                    {
                        this.RingTIme = Convert.ToInt32(jsonObjParaMeters.SelectToken(HttpPostParametersLabels.RING_TIME).ToString());
                    }
                    else
                    {
                        this.RingTIme = 0;
                    }
                    if (jsonObjParaMeters.SelectToken(HttpPostParametersLabels.RING_START_TIME) != null)
                    {
                        this.RingTIme = Convert.ToInt32(jsonObjParaMeters.SelectToken(HttpPostParametersLabels.RING_START_TIME).ToString());
                    }
                    else
                    {
                        this.RingTIme = 0;
                    }
                    if (jsonObjParaMeters.SelectToken(HttpPostParametersLabels.HANGUP_DISPOSITION) != null)
                    {
                        this.HangupDisposition = jsonObjParaMeters.SelectToken(HttpPostParametersLabels.HANGUP_DISPOSITION).ToString();
                    }
                    else
                    {
                        this.HangupDisposition = "";
                    }
                    if (jsonObjParaMeters.SelectToken(HttpPostParametersLabels.REQUEST_UUID) != null)
                    {
                        this.RequestUuid = jsonObjParaMeters.SelectToken(HttpPostParametersLabels.REQUEST_UUID).ToString();
                    }
                    else
                    {
                        this.RequestUuid = "";
                    }
                    if (jsonObjParaMeters.SelectToken(HttpPostParametersLabels.SEQUENCE_NUMBER) != null)
                    {
                        this.SequenceNumber = Convert.ToInt32(jsonObjParaMeters.SelectToken(HttpPostParametersLabels.SEQUENCE_NUMBER).ToString());
                    }
                    else
                    {
                        this.SequenceNumber = 0;
                    }
                    if (jsonObjParaMeters.SelectToken(HttpPostParametersLabels.DIAL_B_LEG_UUID) != null)
                    {
                        this.DialBLegUUID = jsonObjParaMeters.SelectToken(HttpPostParametersLabels.DIAL_B_LEG_UUID).ToString();
                    }
                    else
                    {
                        this.DialBLegUUID = "";
                    }
                    if (jsonObjParaMeters.SelectToken(HttpPostParametersLabels.DIAL_B_LEG_STATUS) != null)
                    {
                        this.DialBLegStatus = jsonObjParaMeters.SelectToken(HttpPostParametersLabels.DIAL_B_LEG_STATUS).ToString();
                    }
                    else
                    {
                        this.DialBLegStatus = "";
                    }
                    if (jsonObjParaMeters.SelectToken(HttpPostParametersLabels.DIAL_A_LEG_UUID) != null)
                    {
                        this.DialALegUUID = jsonObjParaMeters.SelectToken(HttpPostParametersLabels.DIAL_A_LEG_UUID).ToString();
                    }
                    else
                    {
                        this.DialALegUUID = "";
                    }
                    if (jsonObjParaMeters.SelectToken(HttpPostParametersLabels.RECORD_URL) != null)
                    {
                        this.RecordUrl = jsonObjParaMeters.SelectToken(HttpPostParametersLabels.RECORD_URL).ToString();
                    }
                    else
                    {
                        this.RecordUrl = "";
                    }
                    if (jsonObjParaMeters.SelectToken(HttpPostParametersLabels.CALLEE) != null)
                    {
                        this.Callee = jsonObjParaMeters.SelectToken(HttpPostParametersLabels.CALLEE).ToString();
                    }
                    else
                    {
                        this.Callee = "";
                    }
                    if (jsonObjParaMeters.SelectToken(HttpPostParametersLabels.CALLER) != null)
                    {
                        this.Caller = jsonObjParaMeters.SelectToken(HttpPostParametersLabels.CALLER).ToString();
                    }
                    else
                    {
                        this.Caller = "";
                    }
                }
                else
                {
                    Logger.Info("In ParseParameters of StudioController no POST Payload found.");
                }
            };
        }


        public void ParseConferenceParameters(HttpContext context)
       {
           try
           {
               if (context.Request.HttpMethod.ToString().ToUpper() == "GET")
               {
                   if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.CHANNEL_NAME]) == false)
                   {
                       this.ChannelName = context.Request.QueryString[HttpGetParametersLabels.CHANNEL_NAME].ToString();
                   }
                   else
                   {
                       this.ChannelName = "";
                   };
                   if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.IP_PHONE_TRANSFER_HANGUP_MEMBERID]) == false)
                   {
                       this.IpPhoneTransferedMemberId = context.Request.QueryString[HttpGetParametersLabels.IP_PHONE_TRANSFER_HANGUP_MEMBERID].ToString();
                   }
                   else
                   {
                       this.IpPhoneTransferedMemberId = "";
                   };
                   if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.CONFERENCE_DIGITS_MATCH]) == false)
                   {
                       this.ConfDigits = context.Request.QueryString[HttpGetParametersLabels.CONFERENCE_DIGITS_MATCH].ToString();
                   }
                   else
                   {
                       this.ConfDigits = "0";
                   };
                   if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.IS_VERTO_PHONE]) == false)
                   {
                       this.IsVertoPhone = Convert.ToBoolean(context.Request.QueryString[HttpGetParametersLabels.IS_VERTO_PHONE]);
                   }
                   else
                   {
                       this.IsVertoPhone = false;
                   };
                   if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.IS_AGENT]) == false)
                   {
                       this.IsAgent = Convert.ToBoolean(context.Request.QueryString[HttpGetParametersLabels.IS_AGENT].ToString());
                   }
                   else
                   {
                       this.IsAgent = false;
                   };
                   if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.IS_CALLER]) == false)
                   {
                       this.IsCaller = Convert.ToBoolean(context.Request.QueryString[HttpGetParametersLabels.IS_CALLER]);
                   }
                   else
                   {
                       this.IsCaller = false;
                   };
                   if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.IS_WARM_TRANSFER]) == false)
                   {
                       this.IsWarmTransfer = Convert.ToBoolean(context.Request.QueryString[HttpGetParametersLabels.IS_WARM_TRANSFER].ToString());
                   }
                   else
                   {
                       this.IsWarmTransfer = false;
                   };
                   if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.CALLER_SEQUENCE_NUMBER]) == false)
                   {
                       this.CallerSequenceNumber = Convert.ToInt32(context.Request.QueryString[HttpGetParametersLabels.CALLER_SEQUENCE_NUMBER].ToString());
                   }
                   else
                   {
                       this.CallerSequenceNumber = 0;
                   };
                   if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.CALLER_FS_MEMBERID]) == false)
                   {
                       this.CallerFsMemberId = Convert.ToInt32(context.Request.QueryString[HttpGetParametersLabels.CALLER_FS_MEMBERID].ToString());
                   }
                   else
                   {
                       this.CallerFsMemberId = 0;
                   };
                   if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.GATEWAY_URL]) == false)
                   {
                       this.GatewayUrl = context.Request.QueryString[HttpGetParametersLabels.GATEWAY_URL];
                   }
                   else
                   {
                       this.GatewayUrl = "";
                   };
                   if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.TALKING_AGENT_REQUEST_UUID]) == false)
                   {
                       this.TalkingAgentRequestUUID = context.Request.QueryString[HttpGetParametersLabels.TALKING_AGENT_REQUEST_UUID];
                   }
                   else
                   {
                       this.TalkingAgentRequestUUID = "";
                   };
                   if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.IS_TRANSFER_TO_AGENT]) == false)
                   {
                       this.IsTransferToAgent = Convert.ToBoolean(context.Request.QueryString[HttpGetParametersLabels.IS_TRANSFER_TO_AGENT].ToString());
                   }
                   else
                   {
                       this.IsTransferToAgent = false;
                   };
                   if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.CALLUUID]) == false)
                   {
                       this.CallUUid = context.Request.QueryString[HttpGetParametersLabels.CALLUUID];
                   }
                   else
                   {
                       this.CallUUid = "";
                   };
                   if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.TO_NUMBER]) == false)
                   {
                       this.ToNumber = context.Request.QueryString[HttpGetParametersLabels.TO_NUMBER].ToString();
                   }
                   else
                   {
                       this.ToNumber = "";
                   };
                   if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.EVENT]) == false)
                   {
                       this.Event = context.Request.QueryString[HttpGetParametersLabels.EVENT];
                   }
                   else
                   {
                       this.Event = "";
                   };
                   if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.EVENT_TIME]) == false)
                   {
                       this.EventTime = HttpUtility.UrlDecode(context.Request.QueryString[HttpGetParametersLabels.EVENT_TIME]);
                   }
                   else
                   {
                       this.EventTime = "";
                   };
                   if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.FROM_NUMBER]) == false)
                   {
                       this.FromNumber = context.Request.QueryString[HttpGetParametersLabels.FROM_NUMBER];
                   }
                   else
                   {
                       this.FromNumber = "";
                   };
                   if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.IS_OUTBOUND]) == false)
                   {
                       if (context.Request.QueryString[HttpGetParametersLabels.IS_OUTBOUND].ToString() == "inbound")
                       {
                           this.IsOutBound = false;
                       }
                       else
                       {
                           this.IsOutBound = true;
                       }
                   }
                   else
                   {
                       this.IsOutBound = true;
                   };
                   if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.CALL_STATUS]) == false)
                   {
                       this.CallStatus = context.Request.QueryString[HttpGetParametersLabels.CALL_STATUS];
                   }
                   else
                   {
                       this.CallStatus = "";
                   };
                   if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.DIGITS]) == false)
                   {
                       this.Digits = context.Request.QueryString[HttpGetParametersLabels.DIGITS];
                   }
                   else
                   {
                       this.Digits = "";
                   };

                   if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.START_TIME]) == false)
                   {
                       this.StartTime = Convert.ToInt32(context.Request.QueryString[HttpGetParametersLabels.START_TIME].ToString());
                   }
                   else
                   {
                       this.StartTime = 0;
                   };
                   if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.END_TIME]) == false)
                   {
                       this.EndTime = Convert.ToInt32(context.Request.QueryString[HttpGetParametersLabels.END_TIME].ToString());
                   }
                   else
                   {
                       this.EndTime = 0;
                   };

                   if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.REQUEST_UUID]) == false)
                   {
                       this.RequestUuid = context.Request.QueryString[HttpGetParametersLabels.REQUEST_UUID];
                   }
                   else
                   {
                       this.RequestUuid = "";
                   };
                   if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.END_REASON]) == false)
                   {
                       this.EndReason = context.Request.QueryString[HttpGetParametersLabels.END_REASON];
                   }
                   else
                   {
                       this.EndReason = "";
                   };
                   if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.RING_TIME]) == false)
                   {
                       this.RingTIme = Convert.ToInt32(context.Request.QueryString[HttpGetParametersLabels.RING_TIME].ToString());
                   }
                   else
                   {
                       this.RingTIme = 0;
                   };
                   if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.HANGUP_DISPOSITION]) == false)
                   {
                       this.HangupDisposition = context.Request.QueryString[HttpGetParametersLabels.HANGUP_DISPOSITION].ToString();
                   }
                   else
                   {
                       this.HangupDisposition = "";
                   };
                   if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.SEQUENC_ENUMBER]) == false)
                   {
                       this.SequenceNumber = Convert.ToInt32(context.Request.QueryString[HttpGetParametersLabels.SEQUENC_ENUMBER].ToString());
                   }
                   else
                   {
                       this.SequenceNumber = 0;
                   };
                   if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.DIAL_B_LEG_UUID]) == false)
                   {
                       this.DialBLegUUID = context.Request.QueryString[HttpGetParametersLabels.DIAL_B_LEG_UUID];
                   }
                   else
                   {
                       this.DialBLegUUID = "";
                   };
                   if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.RECORD_URL]) == false)
                   {
                       this.RecordUrl = context.Request.QueryString[HttpGetParametersLabels.RECORD_URL];
                   }
                   else
                   {
                       this.RecordUrl = "";
                   };
                   if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.CONFERENCE_PROFILE]) == false)
                   {
                       this.ConferenceProfile = context.Request.QueryString[HttpGetParametersLabels.CONFERENCE_PROFILE];
                   }
                   else
                   {
                       this.ConferenceProfile = "";
                   };
                   if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.CONFERENCE_NAME]) == false)
                   {
                       this.ConferenceName = context.Request.QueryString[HttpGetParametersLabels.CONFERENCE_NAME];
                   }
                   else
                   {
                       this.ConferenceName = "";
                   };
                   if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.CONFERENCE_ACTION]) == false)
                   {
                       this.ConferenceAction = context.Request.QueryString[HttpGetParametersLabels.CONFERENCE_ACTION];
                   }
                   else
                   {
                       this.ConferenceAction = "";
                   };
                   if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.CONFERENCE_SIZE]) == false)
                   {
                       this.ConferenceSize = Convert.ToInt32(context.Request.QueryString[HttpGetParametersLabels.CONFERENCE_SIZE]);
                   }
                   else
                   {
                       this.ConferenceSize = 0;
                   };
                   if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.CONFERENCE_UUID]) == false)
                   {
                       this.ConferenceUUID = context.Request.QueryString[HttpGetParametersLabels.CONFERENCE_UUID];
                   }
                   else
                   {
                       this.ConferenceUUID = "";
                   };
                   if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.CONFERENCE_MEMBER_ID]) == false)
                   {
                       if (context.Request.QueryString[HttpGetParametersLabels.CONFERENCE_MEMBER_ID] == "null")
                       {
                           if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.CONFERENCE_INSTANCE_MEMBER_ID]) == false)
                           {
                               this.ConferenceMemberID = Convert.ToInt32(context.Request.QueryString[HttpGetParametersLabels.CONFERENCE_INSTANCE_MEMBER_ID]);
                           }
                           else
                           {
                               this.ConferenceMemberID = 0;
                           }
                       }
                       else
                       {
                           this.ConferenceMemberID = Convert.ToInt32(context.Request.QueryString[HttpGetParametersLabels.CONFERENCE_MEMBER_ID]);
                       }

                   }
                   else
                   {
                       this.ConferenceMemberID = 0;

                   };
                   if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.EVENT_TIME_STAMP]) == false)
                   {
                       this.Eventtimestamp = Convert.ToInt64(context.Request.QueryString[HttpGetParametersLabels.EVENT_TIME_STAMP]);
                   }
                   else
                   {
                       this.Eventtimestamp = 0;
                   };
                   if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.IS_RING_URL]) == false)
                   {
                       if (context.Request.QueryString[HttpGetParametersLabels.IS_RING_URL].ToString() == "true")
                       {
                           this.IsRingUrl = true;
                       }
                       else
                       {
                           this.IsRingUrl = false;
                       }
                   }
                   else
                   {
                       this.IsRingUrl = false;
                   };
                   if (string.IsNullOrEmpty(context.Request.QueryString[HttpGetParametersLabels.IS_AGENT_DIAL]) == false)
                   {
                       this.IsAgentDial = Convert.ToBoolean(context.Request.QueryString[HttpGetParametersLabels.IS_AGENT_DIAL]);
                   }
                   else
                   {
                       this.IsAgentDial = false;
                   };
               }
               else
               {
                   string jsonStr = "";
                   JObject jsonObj = default(JObject);
                   StreamReader inputStream = null;
                   JObject jsonObjParaMeters = default(JObject);
                   context.Request.InputStream.Position = 0;
                   inputStream = new StreamReader(context.Request.InputStream);
                   jsonStr = HttpUtility.UrlDecode(inputStream.ReadToEnd());
                   jsonObj = new JObject();
                   jsonObj = JObject.Parse(jsonStr);
                   jsonObjParaMeters = JObject.Parse(jsonObj.SelectToken("smscresponse").ToString());

                   if (jsonObjParaMeters.SelectToken("IsWarmTransfer") != null)
                   {
                       this.IsWarmTransfer = Convert.ToBoolean(jsonObjParaMeters.SelectToken("IsWarmTransfer").ToString());
                   }
                   else
                   {
                       this.IsWarmTransfer = false;
                   }
                   if (jsonObjParaMeters.SelectToken("CallerFsMemberId") != null)
                   {
                       this.CallerFsMemberId = Convert.ToInt32(jsonObjParaMeters.SelectToken("CallerFsMemberId").ToString());
                   }
                   else
                   {
                       this.CallerFsMemberId = 0;
                   }
                   if (jsonObjParaMeters.SelectToken("ConferenceDigitsMatch") != null)
                   {
                       this.ConfDigits = jsonObjParaMeters.SelectToken("ConferenceDigitsMatch").ToString();
                   }
                   else
                   {
                       this.ConfDigits = "0";
                   }
                   if (jsonObjParaMeters.SelectToken("CallerSequenceNumber") != null)
                   {
                       this.CallerSequenceNumber = Convert.ToInt32(jsonObjParaMeters.SelectToken("CallerSequenceNumber").ToString());
                   }
                   else
                   {
                       this.CallerSequenceNumber = 0;
                   }

                   if (jsonObjParaMeters.SelectToken("GatewayURL") != null)
                   {
                       this.GatewayUrl = jsonObjParaMeters.SelectToken("GatewayURL").ToString();
                   }
                   else
                   {
                       this.GatewayUrl = "";
                   }
                   if (jsonObjParaMeters.SelectToken("TalkingAgentRequestUUID") != null)
                   {
                       this.TalkingAgentRequestUUID = jsonObjParaMeters.SelectToken("TalkingAgentRequestUUID").ToString();
                   }
                   else
                   {
                       this.TalkingAgentRequestUUID = "";
                   }

                   if (jsonObjParaMeters.SelectToken("IsTransferToAgent") != null)
                   {
                       this.IsTransferToAgent = Convert.ToBoolean(jsonObjParaMeters.SelectToken("IsTransferToAgent").ToString());
                   }
                   else
                   {
                       this.IsTransferToAgent = false;
                   }

                   if (jsonObjParaMeters.SelectToken("calluid") != null)
                   {
                       this.CallUUid = jsonObjParaMeters.SelectToken("calluid").ToString();
                   }
                   else
                   {
                       this.CallUUid = "";
                   }
                   if (jsonObjParaMeters.SelectToken("to") != null)
                   {
                       this.ToNumber = jsonObjParaMeters.SelectToken("to").ToString();
                   }
                   else
                   {
                       this.ToNumber = "";
                   }
                   if (jsonObjParaMeters.SelectToken("from") != null)
                   {
                       this.FromNumber = jsonObjParaMeters.SelectToken("from").ToString();
                   }
                   else
                   {
                       this.FromNumber = "";
                   }
                   if (jsonObjParaMeters.SelectToken("event") != null)
                   {
                       this.Event = jsonObjParaMeters.SelectToken("event").ToString();
                   }
                   else
                   {
                       this.Event = "";
                   }
                   if (jsonObjParaMeters.SelectToken(HttpPostParametersLabels.EVENT_TIME) != null)
                   {
                       this.EventTime = HttpUtility.UrlDecode(jsonObjParaMeters.SelectToken(HttpPostParametersLabels.EVENT_TIME).ToString());
                   }
                   else
                   {
                       this.EventTime = "";
                   }
                       if (jsonObjParaMeters.SelectToken("direction") != null)
                       {
                           if (jsonObjParaMeters.SelectToken("direction").ToString() == "inbound")
                           {
                               this.IsOutBound = false;
                           }
                           else
                           {
                               this.IsOutBound = true;
                           }

                       }
                       else
                       {
                           this.IsOutBound = true;
                       }


                       if (jsonObjParaMeters.SelectToken("callstatus") != null)
                       {
                           this.CallStatus = jsonObjParaMeters.SelectToken("callstatus").ToString();
                       }
                       else
                       {
                           this.CallStatus = "";
                       }
                       if (jsonObjParaMeters.SelectToken("digits") != null)
                       {
                           this.Digits = jsonObjParaMeters.SelectToken("digits").ToString();
                       }
                       else
                       {
                           this.Digits = "";
                       }
                       if (jsonObjParaMeters.SelectToken("endreason") != null)
                       {
                           this.EndReason = jsonObjParaMeters.SelectToken("digits").ToString();
                       }
                       else
                       {
                           this.EndReason = "";
                       }
                       if (jsonObjParaMeters.SelectToken("starttime") != null)
                       {
                           this.StartTime = Convert.ToInt32(jsonObjParaMeters.SelectToken("starttime").ToString());
                       }
                       else
                       {
                           this.StartTime = 0;
                       }
                       if (jsonObjParaMeters.SelectToken("endtime") != null)
                       {
                           this.EndTime = Convert.ToInt32(jsonObjParaMeters.SelectToken("endtime").ToString());
                       }
                       else
                       {
                           this.EndTime = 0;
                       }
                       if (jsonObjParaMeters.SelectToken("ringtime") != null)
                       {
                           this.RingTIme = Convert.ToInt32(jsonObjParaMeters.SelectToken("ringtime").ToString());
                       }
                       else
                       {
                           this.RingTIme = 0;
                       }
                       if (jsonObjParaMeters.SelectToken("hangupdisposition") != null)
                       {
                           this.HangupDisposition = jsonObjParaMeters.SelectToken("hangupdisposition").ToString();
                       }
                       else
                       {
                           this.HangupDisposition = "";
                       }
                       if (jsonObjParaMeters.SelectToken("RequestUUID") != null)
                       {
                           this.RequestUuid = jsonObjParaMeters.SelectToken("RequestUUID").ToString();
                       }
                       else
                       {
                           this.RequestUuid = "";
                       }
                       if (jsonObjParaMeters.SelectToken("SequenceNumber") != null)
                       {
                           this.SequenceNumber = Convert.ToInt32(jsonObjParaMeters.SelectToken("SequenceNumber").ToString());
                       }
                       else
                       {
                           this.SequenceNumber = 0;
                       }
                       if (jsonObjParaMeters.SelectToken("DialBLegUUID") != null)
                       {
                           this.DialBLegUUID = jsonObjParaMeters.SelectToken("DialBLegUUID").ToString();
                       }
                       else
                       {
                           this.DialBLegUUID = "";
                       }
                       if (jsonObjParaMeters.SelectToken("recordurl") != null)
                       {
                           this.RecordUrl = jsonObjParaMeters.SelectToken("recordurl").ToString();
                       }
                       else
                       {
                           this.RecordUrl = "";
                       }
                       if (jsonObjParaMeters.SelectToken("ConferenceProfile") != null)
                       {
                           this.ConferenceProfile = jsonObjParaMeters.SelectToken("ConferenceProfile").ToString();
                       }
                       else
                       {
                           this.ConferenceProfile = "";
                       }
                       if (jsonObjParaMeters.SelectToken("ConferenceName") != null)
                       {
                           this.ConferenceName = jsonObjParaMeters.SelectToken("ConferenceName").ToString();
                       }
                       else
                       {
                           this.ConferenceName = "";
                       }
                       if (jsonObjParaMeters.SelectToken("ConferenceAction") != null)
                       {
                           this.ConferenceAction = jsonObjParaMeters.SelectToken("ConferenceAction").ToString();
                       }
                       else
                       {
                           this.ConferenceAction = "";
                       }
                       if (jsonObjParaMeters.SelectToken("ConferenceSize") != null)
                       {
                           this.ConferenceSize = Convert.ToInt32(jsonObjParaMeters.SelectToken("ConferenceSize").ToString());
                       }
                       else
                       {
                           this.ConferenceSize = 0;
                       }
                       if (jsonObjParaMeters.SelectToken("ConferenceUUID") != null)
                       {
                           this.ConferenceUUID = jsonObjParaMeters.SelectToken("ConferenceUUID").ToString();
                       }
                       else
                       {
                           this.ConferenceUUID = "";
                       }
                       if (jsonObjParaMeters.SelectToken("ConferenceMemberID") != null)
                       {
                           this.ConferenceMemberID = Convert.ToInt32(jsonObjParaMeters.SelectToken("ConferenceMemberID").ToString());
                       }
                       else
                       {
                           this.ConferenceMemberID = 0;
                       }
                       if (jsonObjParaMeters.SelectToken("eventtimestamp") != null)
                       {
                           this.Eventtimestamp = Convert.ToInt64(jsonObjParaMeters.SelectToken("eventtimestamp").ToString());
                       }
                       else
                       {
                           this.Eventtimestamp = 0;
                       }


                       if (jsonObjParaMeters.SelectToken("sequencenumber") != null)
                       {
                           this.SequenceNumber = Convert.ToInt32(jsonObjParaMeters.SelectToken("sequencenumber").ToString());
                       }
                       else
                       {
                           this.SequenceNumber = 0;
                       }
                       if (jsonObjParaMeters.SelectToken("IsAgentDial") != null)
                       {
                           this.IsAgentDial = Convert.ToBoolean(jsonObjParaMeters.SelectToken("IsAgentDial").ToString());
                       }
                       else
                       {
                           this.IsAgentDial = false;
                       }


                   };
               
           }
           catch (Exception ex)
           {

               Logger.Error(ex.ToString());
           }

       }

      

    }
        public class HttpGetParametersLabels
        {
            public const string IS_VERTO_PHONE = "IsVertoPhone";
            public const string EVENT = "smscresponse[event]";
            public const string CALL_STATUS = "smscresponse[callstatus]";
            public const string CALLUUID = "smscresponse[calluid]";
            public const string DIGITS = "smscresponse[digits]";
            public const string FROM_NUMBER = "smscresponse[from]";
            public const string TO_NUMBER = "smscresponse[to]";
            public const string CALLER = "smscresponse[caller]";
            public const string IS_OUTBOUND = "smscresponse[direction]";
            public const string END_REASON = "smscresponse[endreason]";
            public const string HANGUP_DISPOSITION = "smscresponse[hangupdisposition]";
            public const string START_TIME = "smscresponse[starttime]";
            public const string END_TIME = "smscresponse[endtime]";
            public const string INIT_TIME = "smscresponse[inittime]";
            public const string RING_TIME = "smscresponse[ringtime]";
            public const string RING_START_TIME = "smscresponse[ringstarttime]";
            public const string REQUEST_UUID = "smscresponse[RequestUUID]";
            public const string RECORD_URL = "smscresponse[recordurl]";
            public const string SEQUENC_ENUMBER = "smscresponse[SequenceNumber]";
            public const string DIAL_B_LEG_UUID = "smscresponse[DialBLegUUID]";
            public const string DIAL_A_LEG_UUID = "smscresponse[DialALegUUID]";
            public const string DIAL_B_LEG_STATUS = "smscresponse[DialBLegStatus]";
            public const string CONFERENCE_PROFILE = "smscresponse[ConferenceProfile]";
            public const string CONFERENCE_NAME = "smscresponse[ConferenceName]";
            public const string CONFERENCE_ACTION = "smscresponse[ConferenceAction]";
            public const string CONFERENCE_SIZE = "smscresponse[ConferenceSize]";
            public const string CONFERENCE_UUID = "smscresponse[ConferenceUUID]";
            public const string CONFERENCE_MEMBER_ID = "smscresponse[ConferenceMemberId]";
            public const string CONFERENCE_INSTANCE_MEMBER_ID = "smscresponse[ConfInstanceMemberID]";
            public const string BILL_MILL_SEC = "smscresponse[billmsec]";
            public const string EVENT_TIME_STAMP = "smscresponse[eventtimestamp]";
            public const string TALKING_AGENT_REQUEST_UUID = "TalkingAgentRequestUUID";
            public const string IS_TRANSFER_TO_AGENT = "IsTransferToAgent";
            public const string GATEWAY_URL = "GatewayURL";
            public const string IS_WARM_TRANSFER = "IsWarmTransfer";
            public const string CALLER_FS_MEMBERID = "CallerFsMemberId";
            public const string CALLER_SEQUENCE_NUMBER = "CallerSequenceNumber";
            public const string IS_CALLER = "IsCaller";
            public const string IS_AGENT = "IsAgent";
            public const string CALL_BACK_REQUEST_CLIP = "CallBackRequestClip";
            public const string IS_CALLBACK_REQUEST_CALL = "IsCallBackRequestCall";
            public const string CALL_BACK_REQUEST_AGENT_ID = "CallBackRequestAgentId";
            public const string CHANNEL_NAME = "ChannelName";
            public const string CALLEE = "callee";
            public const string IP_PHONE_TRANSFER_HANGUP_MEMBERID = "IpPhoneTransferHangupMember";            
            public const string IS_RING_URL = "IsRingUrl";
            public const string CONFERENCE_DIGITS_MATCH = "smscresponse[ConferenceDigitsMatch]";
            public const string EVENT_TIME = "smscresponse[eventtime]";
            public const string IS_AGENT_DIAL = "smscresponse[isAgentDial]";

        }
        public class HttpPostParametersLabels
        {
            public const string IS_VERTO_PHONE = "IsVertoPhone";
            public const string RING_START_TIME = "ringstarttime";
            public const string EVENT = "event";
            public const string CALL_STATUS = "callstatus";
            public const string CALLUUID = "calluid";
            public const string DIGITS = "digits";
            public const string INIT_TIME = "inittime";
            public const string FROM_NUMBER = "from";
            public const string CALLEE = "callee";
            public const string CALLER = "caller";
            public const string TO_NUMBER = "to";
            public const string IS_OUTBOUND = "direction";
            public const string END_REASON = "endreason";
            public const string HANGUP_DISPOSITION = "hangupdisposition";
            public const string START_TIME = "starttime";
            public const string END_TIME = "endtime";
            public const string RING_TIME = "ringtime";
            public const string REQUEST_UUID = "RequestUUID";
            public const string RECORD_URL = "recordurl";
            public const string SEQUENCE_NUMBER = "SequenceNumber";
            public const string DIAL_B_LEG_UUID = "DialBLegUUID";
            public const string DIAL_A_LEG_UUID = "DialALegUUID";
            public const string DIAL_B_LEG_STATUS = "DialBLegStatus";
            public const string CONFERENCE_PROFILE = "ConferenceProfile";
            public const string CONFERENCE_NAME = "ConferenceName";
            public const string BILL_MILL_SEC = "billmsec";
            public const string CONFERENCE_ACTION = "ConferenceAction";
            public const string CONFERENCE_SIZE = "ConferenceSize";
            public const string CONFERENCE_UUID = "ConferenceUUID";
            public const string CONFERENCE_MEMBER_ID = "ConferenceMemberId";
            public const string EVENT_TIME_STAMP = "eventtimestamp";
            public const string TALKING_AGENT_REQUEST_UUID = "TalkingAgentRequestUUID";
            public const string IS_TRANSFER_TO_AGENT = "IsTransferToAgent";
            public const string GATEWAY_URL = "GatewayURL";
            public const string IS_WARM_TRANSFER = "IsWarmTransfer";
            public const string CALLER_FS_MEMBERID = "CallerFsMemberId";
            public const string CALLER_SEQUENCE_NUMBER = "CallerSequenceNumber";
            public const string IS_CALLER = "IsCaller";
            public const string IS_AGENT = "IsAgent";
            public const string CALL_BACK_REQUEST_CLIP = "CallBackRequestClip";
            public const string IS_CALLBACK_REQUEST_CALL = "IsCallBackRequestCall";
            public const string CALL_BACK_REQUEST_AGENT_ID = "CallBackRequestAgentId";
            public const string CHANNEL_NAME = "ChannelName";
            public const string IS_RING_URL = "IsRingUrl";
            public const string EVENT_TIME = "eventtime";
            public const string CONFERENCE_DIGITS_MATCH = "ConferenceDigitsMatch";
            public const string IS_AGENT_DIAL = "isAgentDial";
        }


    }


