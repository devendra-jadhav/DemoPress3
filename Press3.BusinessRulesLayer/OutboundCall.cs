using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.IO;
using UDC = Press3.UserDefinedClasses;
using Press3.Utilities;
using Newtonsoft.Json.Linq;
using System.Data;


namespace Press3.BusinessRulesLayer
{
    public class OutboundCall
    {
        UDC.HttpParameters httpParameters = new UDC.HttpParameters();
        private Helper helper = null;
        public OutboundCall()
        {
            helper = new Helper();
            helper.ResponseFormat = "json";
            helper.InitializeResponseVariables();
        }
        public JObject UpdateCallDetails(HttpContext context, string connectionString, string outboundCallBackUrl, bool isCustomer, int agentId, string voiceClipPath)
        {
            JObject resObj = new JObject();
            Gateways gatewayObj = new Gateways();
            DataSet ds = null;
            string conferenceRoom = ""; string gatewayURL = "";
            try
            {
                ParseParameters(context);
                UDC.OutboundCall callObj = new UDC.OutboundCall();
                Press3.DataAccessLayer.OutboundCall outboundCallObj = new Press3.DataAccessLayer.OutboundCall(connectionString);

                if (httpParameters.Event == "newcall")
                {
                    callObj.Event = httpParameters.Event;
                    callObj.Id = httpParameters.SequenceNumber;
                    callObj.IsCustomer = isCustomer;
                    if (!isCustomer)
                    {
                        JObject messageJobj = new JObject(new JProperty("Channel_Name", "Agent_o_" + httpParameters.CallUUid),
                                  new JProperty("Message", httpParameters.CallStatus),
                                  new JProperty("CallId", httpParameters.SequenceNumber),
                                  new JProperty("Event", httpParameters.Event));
                        Press3.DataAccessLayer.WebSocketController WSCObj = new Press3.DataAccessLayer.WebSocketController(connectionString);
                        WSCObj.InsertWsNofificationQueue(messageJobj.ToString());
                    }
                    Logger.Info("WebSocket newcall event");
                    
                    ds = outboundCallObj.UpdateCallDetails(callObj);
                    if (ds == null)
                    {
                        helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                        helper.CreateProperty(UDC.Label.SUCCESS, false);
                    }
                    else
                    {
                        ds = outboundCallObj.GetAgentConferenceRoom(httpParameters.SequenceNumber);
                        if (ds == null)
                        {
                            helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                            helper.CreateProperty(UDC.Label.SUCCESS, false);
                        }
                        else
                        {
                            if (ds.Tables.Count > 0)
                            {
                                if (Convert.ToBoolean(ds.Tables[0].Rows[0]["Success"]))
                                {
                                    conferenceRoom = ds.Tables[0].Rows[0]["ConferenceRoom"].ToString();
                                }
                            }
                        }

                        if (isCustomer) {
                            if (conferenceRoom != "")
                            {
                                helper.CreateProperty(UDC.Label.RESPONSEXML, "<Response><Conference callbackUrl='" + outboundCallBackUrl + "?IsCustomer=true&amp;AgentId=" + agentId + "'>" + conferenceRoom + "</Conference></Response>");
                            }
                            else
                            {
                                helper.CreateProperty(UDC.Label.RESPONSEXML, "<Response></Hangup></Response>");
                            }
                        }
                        else
                        {
                            helper.CreateProperty(UDC.Label.RESPONSEXML, "<Response><Conference waitSound='" + voiceClipPath + "AloneWaitClip.mp3' callbackUrl='" + outboundCallBackUrl + "?IsCustomer=false&amp;AgentId=" + agentId + "'>" + httpParameters.CallUUid + "</Conference></Response>");
                        }
                        helper.ParseDataSet(ds);
                    }
                }
                else if (httpParameters.Event == "hangup")
                {
                    callObj.Event = httpParameters.Event;
                    callObj.Id = httpParameters.SequenceNumber;
                    callObj.RingTime = httpParameters.RingTIme;
                    callObj.AnswerTime = httpParameters.StartTime;
                    callObj.EndTime = httpParameters.EndTime;
                    callObj.EndReason = httpParameters.EndReason;
                    callObj.HangupDisposition = httpParameters.HangupDisposition;
                    callObj.IsCustomer = isCustomer;

                    JObject messageJobj = new JObject();
                    Press3.DataAccessLayer.WebSocketController WSCObj = new Press3.DataAccessLayer.WebSocketController(connectionString);

                    if (!isCustomer)
                    {
                        messageJobj = new JObject(new JProperty("Channel_Name", "Agent_o_" + httpParameters.CallUUid),
                                   new JProperty("Message", httpParameters.EndReason),
                                   new JProperty("CallId", httpParameters.SequenceNumber),
                                   new JProperty("Event", httpParameters.Event));
                        WSCObj.InsertWsNofificationQueue(messageJobj.ToString());
                    }
                     

                    ds = outboundCallObj.UpdateCallDetails(callObj);
                    if (ds == null)
                    {
                        helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                        helper.CreateProperty(UDC.Label.SUCCESS, false);
                    }
                    else
                    {
                        ds = outboundCallObj.GetAgentConferenceRoom(httpParameters.SequenceNumber);
                        if (ds == null)
                        {
                            helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                            helper.CreateProperty(UDC.Label.SUCCESS, false);
                        }
                        else
                        {
                            if (ds.Tables.Count > 0)
                            {
                                if (Convert.ToBoolean(ds.Tables[0].Rows[0]["Success"]))
                                {
                                    gatewayURL = ds.Tables[0].Rows[0]["GatewayURL"].ToString();
                                    conferenceRoom = ds.Tables[0].Rows[0]["ConferenceRoom"].ToString();
                                }
                            }
                        }
                        helper.ParseDataSet(ds);
                    }


                    messageJobj = new JObject(new JProperty("Channel_Name", "Agent_" + agentId),
                           new JProperty("CallId", httpParameters.SequenceNumber.ToString()),
                           new JProperty("ConferenceRoom", conferenceRoom),
                           new JProperty("FromNumber", httpParameters.FromNumber),
                           new JProperty("IsAgent", true),
                           new JProperty("CallType", 1),
                           new JProperty("RequestUUID", httpParameters.RequestUuid),
                           new JProperty("IsOutbound", 1),
                           new JProperty("Event", "exit"));
                    WSCObj.InsertWsNofificationQueue(messageJobj.ToString());
                    Logger.Info("WebSocket hangup event");


                    JObject apiResponseObj = new JObject();
                    JObject apiResponseObjPrivate = new JObject();
                    Gateways gatewaysObj = new Gateways();
                    Press3.DataAccessLayer.Conference confObj = new Press3.DataAccessLayer.Conference(connectionString);
                    apiResponseObj = gatewaysObj.RestApiRequest("ConferenceName=" + conferenceRoom + "&MemberID=all", gatewayURL + "ConferenceHangup/", "POST");
                    apiResponseObjPrivate = gatewaysObj.RestApiRequest("ConferenceName=private_" + conferenceRoom + "&MemberID=all", gatewayURL + "ConferenceHangup/", "POST");

                    if (isCustomer)
                    {
                        ds = outboundCallObj.UpdateCallBackRequestStatus(callObj);
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

                }
                else if (httpParameters.Event == "conference" && httpParameters.ConferenceAction == "enter")
                {
                    callObj.Id = httpParameters.SequenceNumber;
                    callObj.Event = httpParameters.Event;
                    callObj.ConferenceAction = httpParameters.ConferenceAction;
                    callObj.RequestUUID = httpParameters.RequestUuid;
                    callObj.Source = httpParameters.FromNumber;
                    callObj.Destination = httpParameters.ToNumber;
                    callObj.FsMemberId = httpParameters.ConferenceMemberID;
                    callObj.IsCustomer = isCustomer;
                    callObj.EventTimeStamp = httpParameters.Eventtimestamp;
                    callObj.ConferenceName = httpParameters.ConferenceName;
                    callObj.AgentId = agentId;

                    if (isCustomer)
                    {
                        if (!httpParameters.ConferenceName.StartsWith("private"))
                        {
                            JObject messageJobj = new JObject(new JProperty("Channel_Name", "Agent_" + agentId),
                                new JProperty("CallId", httpParameters.SequenceNumber.ToString()),
                                new JProperty("ConferenceRoom", httpParameters.ConferenceName),
                                new JProperty("FromNumber", httpParameters.FromNumber),
                                new JProperty("IsAgent", true),
                                new JProperty("CallType", 1),
                                new JProperty("RequestUUID", httpParameters.RequestUuid),
                                new JProperty("IsOutbound", 1),
                                new JProperty("Event", httpParameters.ConferenceAction));
                            Press3.DataAccessLayer.WebSocketController WSCObj = new Press3.DataAccessLayer.WebSocketController(connectionString);
                            WSCObj.InsertWsNofificationQueue(messageJobj.ToString());
                        }
                    }
                    else
                    {
                        JObject messageJobj = new JObject(new JProperty("Channel_Name", "Agent_" + agentId),
                           new JProperty("CallId", httpParameters.SequenceNumber.ToString()),
                           new JProperty("ConferenceRoom", httpParameters.ConferenceName),
                           new JProperty("FromNumber", httpParameters.FromNumber),
                           new JProperty("IsAgent", true),
                           new JProperty("CallType", 9),
                           new JProperty("RequestUUID", httpParameters.RequestUuid),
                           new JProperty("IsOutbound", 1),
                           new JProperty("ConferenceEvent", httpParameters.ConferenceAction),
                           new JProperty("Event", "CustomerOutBound"));
                        Press3.DataAccessLayer.WebSocketController WSCObj = new Press3.DataAccessLayer.WebSocketController(connectionString);
                        WSCObj.InsertWsNofificationQueue(messageJobj.ToString());
                    }

                    ds = outboundCallObj.UpdateOutboundConferenceDetails(callObj);
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
                else if (httpParameters.Event == "conference" && httpParameters.ConferenceAction == "exit")
                {
                    callObj.Id = httpParameters.SequenceNumber;
                    callObj.Event = httpParameters.Event;
                    callObj.ConferenceAction = httpParameters.ConferenceAction;
                    callObj.FsMemberId = httpParameters.ConferenceMemberID;
                    callObj.EventTimeStamp = httpParameters.Eventtimestamp;

                    ds = outboundCallObj.UpdateOutboundConferenceDetails(callObj);
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
            }
            catch (Exception ex)
            {
                Logger.Error("Exception in BAL.UpdateCallDetails" + ex.ToString());
            }
            return helper.GetResponse();
        }
        void ParseParameters(HttpContext context)
        {
            try
            {
                if (context.Request.HttpMethod.ToString().ToUpper() == "GET")
                {
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.CHANNEL_NAME]) == false)
                    {
                        httpParameters.ChannelName = context.Request.QueryString[UDC.HttpGetParametersLabels.CHANNEL_NAME].ToString();
                    }
                    else
                    {
                        httpParameters.ChannelName = "";
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.IS_VERTO_PHONE]) == false)
                    {
                        httpParameters.IsVertoPhone = Convert.ToBoolean(context.Request.QueryString[UDC.HttpGetParametersLabels.IS_VERTO_PHONE]);
                    }
                    else
                    {
                        httpParameters.IsVertoPhone = false;
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.IS_AGENT]) == false)
                    {
                        httpParameters.IsAgent = Convert.ToBoolean(context.Request.QueryString[UDC.HttpGetParametersLabels.IS_AGENT].ToString());
                    }
                    else
                    {
                        httpParameters.IsAgent = false;
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.IS_CALLER]) == false)
                    {
                        httpParameters.IsCaller = Convert.ToBoolean(context.Request.QueryString[UDC.HttpGetParametersLabels.IS_CALLER]);
                    }
                    else
                    {
                        httpParameters.IsCaller = false;
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.IS_WARM_TRANSFER]) == false)
                    {
                        httpParameters.IsWarmTransfer = Convert.ToBoolean(context.Request.QueryString[UDC.HttpGetParametersLabels.IS_WARM_TRANSFER].ToString());
                    }
                    else
                    {
                        httpParameters.IsWarmTransfer = false;
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.CALLER_SEQUENCE_NUMBER]) == false)
                    {
                        httpParameters.CallerSequenceNumber = Convert.ToInt32(context.Request.QueryString[UDC.HttpGetParametersLabels.CALLER_SEQUENCE_NUMBER].ToString());
                    }
                    else
                    {
                        httpParameters.CallerSequenceNumber = 0;
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.CALLER_FS_MEMBERID]) == false)
                    {
                        httpParameters.CallerFsMemberId = Convert.ToInt32(context.Request.QueryString[UDC.HttpGetParametersLabels.CALLER_FS_MEMBERID].ToString());
                    }
                    else
                    {
                        httpParameters.CallerFsMemberId = 0;
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.GATEWAY_URL]) == false)
                    {
                        httpParameters.GatewayUrl = context.Request.QueryString[UDC.HttpGetParametersLabels.GATEWAY_URL];
                    }
                    else
                    {
                        httpParameters.GatewayUrl = "";
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.TALKING_AGENT_REQUEST_UUID]) == false)
                    {
                        httpParameters.TalkingAgentRequestUUID = context.Request.QueryString[UDC.HttpGetParametersLabels.TALKING_AGENT_REQUEST_UUID];
                    }
                    else
                    {
                        httpParameters.TalkingAgentRequestUUID = "";
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.IS_TRANSFER_TO_AGENT]) == false)
                    {
                        httpParameters.IsTransferToAgent = Convert.ToBoolean(context.Request.QueryString[UDC.HttpGetParametersLabels.IS_TRANSFER_TO_AGENT].ToString());
                    }
                    else
                    {
                        httpParameters.IsTransferToAgent = false;
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.CALLUUID]) == false)
                    {
                        httpParameters.CallUUid = context.Request.QueryString[UDC.HttpGetParametersLabels.CALLUUID];
                    }
                    else
                    {
                        httpParameters.CallUUid = "";
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.TO_NUMBER]) == false)
                    {
                        httpParameters.ToNumber = context.Request.QueryString[UDC.HttpGetParametersLabels.TO_NUMBER].ToString();
                    }
                    else
                    {
                        httpParameters.ToNumber = "";
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.EVENT]) == false)
                    {
                        httpParameters.Event = context.Request.QueryString[UDC.HttpGetParametersLabels.EVENT];
                    }
                    else
                    {
                        httpParameters.Event = "";
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.FROM_NUMBER]) == false)
                    {
                        httpParameters.FromNumber = context.Request.QueryString[UDC.HttpGetParametersLabels.FROM_NUMBER];
                    }
                    else
                    {
                        httpParameters.FromNumber = "";
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.IS_OUTBOUND]) == false)
                    {
                        if (context.Request.QueryString[UDC.HttpGetParametersLabels.IS_OUTBOUND].ToString() == "inbound")
                        {
                            httpParameters.IsOutBound = false;
                        }
                        else
                        {
                            httpParameters.IsOutBound = true;
                        }
                    }
                    else
                    {
                        httpParameters.IsOutBound = true;
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.CALL_STATUS]) == false)
                    {
                        httpParameters.CallStatus = context.Request.QueryString[UDC.HttpGetParametersLabels.CALL_STATUS];
                    }
                    else
                    {
                        httpParameters.CallStatus = "";
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.DIGITS]) == false)
                    {
                        httpParameters.Digits = context.Request.QueryString[UDC.HttpGetParametersLabels.DIGITS];
                    }
                    else
                    {
                        httpParameters.Digits = "";
                    };

                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.START_TIME]) == false)
                    {
                        httpParameters.StartTime = Convert.ToInt32(context.Request.QueryString[UDC.HttpGetParametersLabels.START_TIME].ToString());
                    }
                    else
                    {
                        httpParameters.StartTime = 0;
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.END_TIME]) == false)
                    {
                        httpParameters.EndTime = Convert.ToInt32(context.Request.QueryString[UDC.HttpGetParametersLabels.END_TIME].ToString());
                    }
                    else
                    {
                        httpParameters.EndTime = 0;
                    };

                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.REQUEST_UUID]) == false)
                    {
                        httpParameters.RequestUuid = context.Request.QueryString[UDC.HttpGetParametersLabels.REQUEST_UUID];
                    }
                    else
                    {
                        httpParameters.RequestUuid = "";
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.END_REASON]) == false)
                    {
                        httpParameters.EndReason = context.Request.QueryString[UDC.HttpGetParametersLabels.END_REASON];
                    }
                    else
                    {
                        httpParameters.EndReason = "";
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.RING_TIME]) == false)
                    {
                        httpParameters.RingTIme = Convert.ToInt32(context.Request.QueryString[UDC.HttpGetParametersLabels.RING_TIME].ToString());
                    }
                    else
                    {
                        httpParameters.RingTIme = 0;
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.HANGUP_DISPOSITION]) == false)
                    {
                        httpParameters.HangupDisposition = context.Request.QueryString[UDC.HttpGetParametersLabels.HANGUP_DISPOSITION].ToString();
                    }
                    else
                    {
                        httpParameters.HangupDisposition = "";
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.SEQUENC_ENUMBER]) == false)
                    {
                        httpParameters.SequenceNumber = Convert.ToInt32(context.Request.QueryString[UDC.HttpGetParametersLabels.SEQUENC_ENUMBER].ToString());
                    }
                    else
                    {
                        httpParameters.SequenceNumber = 0;
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.DIAL_B_LEG_UUID]) == false)
                    {
                        httpParameters.DialBLegUUID = context.Request.QueryString[UDC.HttpGetParametersLabels.DIAL_B_LEG_UUID];
                    }
                    else
                    {
                        httpParameters.DialBLegUUID = "";
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.RECORD_URL]) == false)
                    {
                        httpParameters.RecordUrl = context.Request.QueryString[UDC.HttpGetParametersLabels.RECORD_URL];
                    }
                    else
                    {
                        httpParameters.RecordUrl = "";
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.CONFERENCE_PROFILE]) == false)
                    {
                        httpParameters.ConferenceProfile = context.Request.QueryString[UDC.HttpGetParametersLabels.CONFERENCE_PROFILE];
                    }
                    else
                    {
                        httpParameters.ConferenceProfile = "";
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.CONFERENCE_NAME]) == false)
                    {
                        httpParameters.ConferenceName = context.Request.QueryString[UDC.HttpGetParametersLabels.CONFERENCE_NAME];
                    }
                    else
                    {
                        httpParameters.ConferenceName = "";
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.CONFERENCE_ACTION]) == false)
                    {
                        httpParameters.ConferenceAction = context.Request.QueryString[UDC.HttpGetParametersLabels.CONFERENCE_ACTION];
                    }
                    else
                    {
                        httpParameters.ConferenceAction = "";
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.CONFERENCE_SIZE]) == false)
                    {
                        httpParameters.ConferenceSize = Convert.ToInt32(context.Request.QueryString[UDC.HttpGetParametersLabels.CONFERENCE_SIZE]);
                    }
                    else
                    {
                        httpParameters.ConferenceSize = 0;
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.CONFERENCE_UUID]) == false)
                    {
                        httpParameters.ConferenceUUID = context.Request.QueryString[UDC.HttpGetParametersLabels.CONFERENCE_UUID];
                    }
                    else
                    {
                        httpParameters.ConferenceUUID = "";
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.CONFERENCE_MEMBER_ID]) == false)
                    {
                        if (context.Request.QueryString[UDC.HttpGetParametersLabels.CONFERENCE_MEMBER_ID] == "null")
                        {
                            if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.CONFERENCE_INSTANCE_MEMBER_ID]) == false)
                            {
                                httpParameters.ConferenceMemberID = Convert.ToInt32(context.Request.QueryString[UDC.HttpGetParametersLabels.CONFERENCE_INSTANCE_MEMBER_ID]);
                            }
                            else
                            {
                                httpParameters.ConferenceMemberID = 0;
                            }
                        }
                        else
                        {
                            httpParameters.ConferenceMemberID = Convert.ToInt32(context.Request.QueryString[UDC.HttpGetParametersLabels.CONFERENCE_MEMBER_ID]);
                        }

                    }
                    else
                    {
                        httpParameters.ConferenceMemberID = 0;

                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.EVENT_TIME_STAMP]) == false)
                    {
                        httpParameters.Eventtimestamp = Convert.ToInt32(context.Request.QueryString[UDC.HttpGetParametersLabels.EVENT_TIME_STAMP]);
                    }
                    else
                    {
                        httpParameters.Eventtimestamp = 0;
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.IS_RING_URL]) == false)
                    {
                        if (context.Request.QueryString[UDC.HttpGetParametersLabels.IS_RING_URL].ToString() == "true")
                        {
                            httpParameters.IsRingUrl = true;
                        }
                        else
                        {
                            httpParameters.IsRingUrl = false;
                        }
                    }
                    else
                    {
                        httpParameters.IsRingUrl = false;
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
                    jsonStr = inputStream.ReadToEnd();
                    jsonObj = new JObject();
                    jsonObj = JObject.Parse(jsonStr);
                    jsonObjParaMeters = JObject.Parse(jsonObj.SelectToken("smscresponse").ToString());


                    if (jsonObjParaMeters.SelectToken("IsWarmTransfer") != null)
                    {
                        httpParameters.IsWarmTransfer = Convert.ToBoolean(jsonObjParaMeters.SelectToken("IsWarmTransfer").ToString());
                    }
                    else
                    {
                        httpParameters.IsWarmTransfer = false;
                    }
                    if (jsonObjParaMeters.SelectToken("CallerFsMemberId") != null)
                    {
                        httpParameters.CallerFsMemberId = Convert.ToInt32(jsonObjParaMeters.SelectToken("CallerFsMemberId").ToString());
                    }
                    else
                    {
                        httpParameters.CallerFsMemberId = 0;
                    }
                    if (jsonObjParaMeters.SelectToken("CallerSequenceNumber") != null)
                    {
                        httpParameters.CallerSequenceNumber = Convert.ToInt32(jsonObjParaMeters.SelectToken("CallerSequenceNumber").ToString());
                    }
                    else
                    {
                        httpParameters.CallerSequenceNumber = 0;
                    }


                    if (jsonObjParaMeters.SelectToken("GatewayURL") != null)
                    {
                        httpParameters.GatewayUrl = jsonObjParaMeters.SelectToken("GatewayURL").ToString();
                    }
                    else
                    {
                        httpParameters.GatewayUrl = "";
                    }
                    if (jsonObjParaMeters.SelectToken("TalkingAgentRequestUUID") != null)
                    {
                        httpParameters.TalkingAgentRequestUUID = jsonObjParaMeters.SelectToken("TalkingAgentRequestUUID").ToString();
                    }
                    else
                    {
                        httpParameters.TalkingAgentRequestUUID = "";
                    }

                    if (jsonObjParaMeters.SelectToken("IsTransferToAgent") != null)
                    {
                        httpParameters.IsTransferToAgent = Convert.ToBoolean(jsonObjParaMeters.SelectToken("IsTransferToAgent").ToString());
                    }
                    else
                    {
                        httpParameters.IsTransferToAgent = false;
                    }

                    if (jsonObjParaMeters.SelectToken("calluid") != null)
                    {
                        httpParameters.CallUUid = jsonObjParaMeters.SelectToken("calluid").ToString();
                    }
                    else
                    {
                        httpParameters.CallUUid = "";
                    }
                    if (jsonObjParaMeters.SelectToken("to") != null)
                    {
                        httpParameters.ToNumber = jsonObjParaMeters.SelectToken("to").ToString();
                    }
                    else
                    {
                        httpParameters.ToNumber = "";
                    }
                    if (jsonObjParaMeters.SelectToken("from") != null)
                    {
                        httpParameters.FromNumber = jsonObjParaMeters.SelectToken("from").ToString();
                    }
                    else
                    {
                        httpParameters.FromNumber = "";
                    }
                    if (jsonObjParaMeters.SelectToken("event") != null)
                    {
                        httpParameters.Event = jsonObjParaMeters.SelectToken("event").ToString();
                    }
                    else
                    {
                        httpParameters.Event = "";
                    }
                    if (jsonObjParaMeters.SelectToken("direction") != null)
                    {
                        if (jsonObjParaMeters.SelectToken("direction").ToString() == "inbound")
                        {
                            httpParameters.IsOutBound = false;
                        }
                        else
                        {
                            httpParameters.IsOutBound = true;
                        }

                    }
                    else
                    {
                        httpParameters.IsOutBound = true;
                    }
                    if (jsonObjParaMeters.SelectToken("callstatus") != null)
                    {
                        httpParameters.CallStatus = jsonObjParaMeters.SelectToken("callstatus").ToString();
                    }
                    else
                    {
                        httpParameters.CallStatus = "";
                    }
                    if (jsonObjParaMeters.SelectToken("digits") != null)
                    {
                        httpParameters.Digits = jsonObjParaMeters.SelectToken("digits").ToString();
                    }
                    else
                    {
                        httpParameters.Digits = "";
                    }
                    if (jsonObjParaMeters.SelectToken("endreason") != null)
                    {
                        httpParameters.EndReason = jsonObjParaMeters.SelectToken("digits").ToString();
                    }
                    else
                    {
                        httpParameters.EndReason = "";
                    }
                    if (jsonObjParaMeters.SelectToken("starttime") != null)
                    {
                        httpParameters.StartTime = Convert.ToInt32(jsonObjParaMeters.SelectToken("starttime").ToString());
                    }
                    else
                    {
                        httpParameters.StartTime = 0;
                    }
                    if (jsonObjParaMeters.SelectToken("endtime") != null)
                    {
                        httpParameters.EndTime = Convert.ToInt32(jsonObjParaMeters.SelectToken("endtime").ToString());
                    }
                    else
                    {
                        httpParameters.EndTime = 0;
                    }
                    if (jsonObjParaMeters.SelectToken("ringtime") != null)
                    {
                        httpParameters.RingTIme = Convert.ToInt32(jsonObjParaMeters.SelectToken("ringtime").ToString());
                    }
                    else
                    {
                        httpParameters.RingTIme = 0;
                    }
                    if (jsonObjParaMeters.SelectToken("hangupdisposition") != null)
                    {
                        httpParameters.HangupDisposition = jsonObjParaMeters.SelectToken("hangupdisposition").ToString();
                    }
                    else
                    {
                        httpParameters.HangupDisposition = "";
                    }
                    if (jsonObjParaMeters.SelectToken("RequestUUID") != null)
                    {
                        httpParameters.RequestUuid = jsonObjParaMeters.SelectToken("RequestUUID").ToString();
                    }
                    else
                    {
                        httpParameters.RequestUuid = "";
                    }
                    if (jsonObjParaMeters.SelectToken("SequenceNumber") != null)
                    {
                        httpParameters.SequenceNumber = Convert.ToInt32(jsonObjParaMeters.SelectToken("SequenceNumber").ToString());
                    }
                    else
                    {
                        if (jsonObjParaMeters.SelectToken("sequencenumber") != null)
                        {
                            httpParameters.SequenceNumber = Convert.ToInt32(jsonObjParaMeters.SelectToken("sequencenumber").ToString());
                        }
                        else
                        {
                            httpParameters.SequenceNumber = 0;
                        }
                    }
                    if (jsonObjParaMeters.SelectToken("DialBLegUUID") != null)
                    {
                        httpParameters.DialBLegUUID = jsonObjParaMeters.SelectToken("DialBLegUUID").ToString();
                    }
                    else
                    {
                        httpParameters.DialBLegUUID = "";
                    }
                    if (jsonObjParaMeters.SelectToken("recordurl") != null)
                    {
                        httpParameters.RecordUrl = jsonObjParaMeters.SelectToken("recordurl").ToString();
                    }
                    else
                    {
                        httpParameters.RecordUrl = "";
                    }
                    if (jsonObjParaMeters.SelectToken("ConferenceProfile") != null)
                    {
                        httpParameters.ConferenceProfile = jsonObjParaMeters.SelectToken("ConferenceProfile").ToString();
                    }
                    else
                    {
                        httpParameters.ConferenceProfile = "";
                    }
                    if (jsonObjParaMeters.SelectToken("ConferenceName") != null)
                    {
                        httpParameters.ConferenceName = jsonObjParaMeters.SelectToken("ConferenceName").ToString();
                    }
                    else
                    {
                        httpParameters.ConferenceName = "";
                    }
                    if (jsonObjParaMeters.SelectToken("ConferenceAction") != null)
                    {
                        httpParameters.ConferenceAction = jsonObjParaMeters.SelectToken("ConferenceAction").ToString();
                    }
                    else
                    {
                        httpParameters.ConferenceAction = "";
                    }
                    if (jsonObjParaMeters.SelectToken("ConferenceSize") != null)
                    {
                        httpParameters.ConferenceSize = Convert.ToInt32(jsonObjParaMeters.SelectToken("ConferenceSize").ToString());
                    }
                    else
                    {
                        httpParameters.ConferenceSize = 0;
                    }
                    if (jsonObjParaMeters.SelectToken("ConferenceUUID") != null)
                    {
                        httpParameters.ConferenceUUID = jsonObjParaMeters.SelectToken("ConferenceUUID").ToString();
                    }
                    else
                    {
                        httpParameters.ConferenceUUID = "";
                    }
                    if (jsonObjParaMeters.SelectToken("ConferenceMemberID") != null && jsonObjParaMeters.SelectToken("ConferenceMemberID").ToString() != "null")
                    {
                        httpParameters.ConferenceMemberID = Convert.ToInt32(jsonObjParaMeters.SelectToken("ConferenceMemberID").ToString());
                    }
                    else
                    {
                        if (jsonObjParaMeters.SelectToken("ConfInstanceMemberID") != null)
                        {
                            httpParameters.ConferenceMemberID = Convert.ToInt32(jsonObjParaMeters.SelectToken("ConfInstanceMemberID").ToString());
                        }
                        else
                        {
                            httpParameters.ConferenceMemberID = 0;
                        }
                    }
                    if (jsonObjParaMeters.SelectToken("eventtimestamp") != null)
                    {
                        httpParameters.Eventtimestamp = Convert.ToInt32(jsonObjParaMeters.SelectToken("eventtimestamp").ToString());
                    }
                    else
                    {
                        httpParameters.Eventtimestamp = 0;
                    }

                };

            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }

        }
    }
}

