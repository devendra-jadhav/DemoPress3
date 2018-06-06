using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json.Linq;
using Press3.Utilities;
using System.Text;
using Press3.UI.CommonClasses;
using UDC = Press3.UserDefinedClasses;
using System.Xml;
using System.Collections;
using System.Data;
using System.Web.SessionState;


namespace Press3.UI.Handlers
{
    /// <summary>
    /// Summary description for Studio
    /// </summary>
    public class Studio : IHttpHandler, IRequiresSessionState
    {
        public Int32 agentId = 0;
        public Int32 accountId = 0;
        public Int32 loginId = 0;
        public Int32 roleId = 0;
        public JObject sessionObj = new JObject();
        public void ProcessRequest(HttpContext context)
        {
            try
            {
                if (context.Session["AgentId"] != null)
                {
                    agentId = Convert.ToInt32(context.Session["AgentId"]);
                    if (context.Session["LoginId"] != null)
                        loginId = Convert.ToInt32(context.Session["LoginId"]);
                    if (context.Session["RoleId"] != null)
                        roleId = Convert.ToInt32(context.Session["RoleId"]);
                    if (context.Session["AccountId"] != null)
                        accountId = Convert.ToInt32(context.Session["AccountId"]);
                }
                else
                {
                    HttpContext.Current.Response.StatusCode = 401;
                    return;
                }

                try
                {
                    sessionObj = CheckSession(context);
                    //context.Response.Write(sessionObj);
                    if (sessionObj != null)
                    {
                        if (sessionObj.SelectToken("Success").ToString() == "False")
                        {
                            HttpContext.Current.Response.StatusCode = 406;
                            return;
                        }
                        else
                        {
                            JObject resJObj = new JObject();
                            int type = Convert.ToInt32(context.Request["type"]);
                            switch (type)
                            {
                                case 1: //  To generate ivr studio popups
                                    resJObj = GenerateStudioPopups(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 2: //  To create studio
                                    resJObj = CreateStudio(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 3: // To get studio details
                                    resJObj = GetStudioDetails(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 4: //  To convert text to speech
                                    resJObj = ConvertTextToSpeech(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 5: //  To generate ivr studio edit popups
                                    resJObj = GetStudioNodeDetails(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 6: //  To get Sms or Email templates
                                    resJObj = GetEmailOrSmsTemplate(context, Convert.ToInt16(context.Request["mode"]), Convert.ToInt16(context.Request["templateId"]));
                                    context.Response.Write(resJObj);
                                    break;
                                case 7: //  To get time slot timings
                                    resJObj = GetTimeSlotTimings(context, Convert.ToInt16(context.Request["timeSlotId"]));
                                    context.Response.Write(resJObj);
                                    break;
                                case 8: //  To get time slots
                                    resJObj = GetTimeSlot(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 9: //  To get skill groups
                                    resJObj = GetSkillGroups(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 10: //  To get account callerids
                                    resJObj = GetAccountCallerIds(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 11: //  To get account studio purposes
                                    resJObj = GetAccountStudioPurposes(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 12: //  To create or update studio generic details
                                    resJObj = CreateOrUpdateStudioGenericDetails(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 13: //  To get studio generic details
                                    resJObj = GetStudioGenericDetails(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 14: //  To get all studios
                                    resJObj = GetStudios(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 15: //  To update callerid number for studio
                                    resJObj = UpdateStudioCallerIdNumber(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 16: //  To delete studio
                                    resJObj = DeleteStudio(context);
                                    context.Response.Write(resJObj);
                                    break;
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    Logger.Error("Exception in Session check:" + ex.ToString());
                    throw ex;
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
        }

        public JObject CheckSession(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                resultObj = managerObj.CheckSession(MyConfig.MyConnectionString, loginId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public JObject CreateOrUpdateStudioGenericDetails(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Studio studioObj = new BusinessRulesLayer.Studio();
                UDC.Studio studio = new UDC.Studio();
                studio.AccountId = accountId;
                studio.CallerIdId = (context.Request["callerId"] != null && context.Request["callerId"] != "") ? Convert.ToInt32(context.Request["callerId"]) : 0;
                studio.AgentId = agentId;
                studio.IsOutbound = (context.Request["isOutbound"] != null && context.Request["isOutbound"] != "") ? Convert.ToByte(context.Request["isOutbound"]) : Convert.ToByte(0);
                studio.IsActive = (context.Request["isActive"] != null && context.Request["isActive"] != "") ? Convert.ToByte(context.Request["isActive"]) : Convert.ToByte(0);
                studio.Id = (context.Request["studioId"] != null && context.Request["studioId"] != "") ? Convert.ToInt32(context.Request["studioId"]) : 0;
                studio.Name = context.Request["studioName"];
                studio.PurposeId = (context.Request["studioPurposeId"] != null && context.Request["studioPurposeId"] != "") ? Convert.ToInt32(context.Request["studioPurposeId"]) : 0;
                studio.Purpose = context.Request["studioPurpose"];
                resultObj = studioObj.CreateOrUpdateStudioGenericDetails(MyConfig.MyConnectionString, studio);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public JObject GetAccountCallerIds(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Studio studioObj = new BusinessRulesLayer.Studio();
                resultObj = studioObj.GetAccountCallerIds(MyConfig.MyConnectionString, accountId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public JObject GetAccountStudioPurposes(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Studio studioObj = new BusinessRulesLayer.Studio();
                resultObj = studioObj.GetAccountStudioPurposes(MyConfig.MyConnectionString, accountId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public JObject GetStudioGenericDetails(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Studio studioObj = new BusinessRulesLayer.Studio();
                resultObj = studioObj.GetStudioGenericDetails(MyConfig.MyConnectionString, Convert.ToInt32(context.Request["StudioId"]));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }

        public JObject GetStudios(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Studio studioObj = new BusinessRulesLayer.Studio();
                resultObj = studioObj.GetStudios(MyConfig.MyConnectionString, accountId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public JObject GetStudioDetails(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Studio studioObj = new BusinessRulesLayer.Studio();
                resultObj = studioObj.GetStudioDetails(MyConfig.MyConnectionString, accountId, Convert.ToInt32(context.Request["studioId"]));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }

        public JObject UpdateStudioCallerIdNumber(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Studio studioObj = new BusinessRulesLayer.Studio();
                UDC.StudioCallerId studioCallerId = new UDC.StudioCallerId();
                studioCallerId.AccountId = accountId;
                studioCallerId.AgentId = agentId;
                studioCallerId.Id = (context.Request["accountCallerId"] != null && context.Request["accountCallerId"] != "") ? Convert.ToInt32(context.Request["accountCallerId"]) : 0;
                studioCallerId.StudioId = Convert.ToInt32(context.Request["StudioId"]);
                studioCallerId.IsDeactive = (context.Request["status"] != null && context.Request["status"] != "") ? Convert.ToBoolean(Convert.ToInt32(context.Request["status"])) : Convert.ToBoolean(0);
                resultObj = studioObj.UpdateStudioCallerIdNumber(MyConfig.MyConnectionString, studioCallerId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public JObject GetStudioNodeDetails(HttpContext context)
        {
            JObject resultObj = new JObject();
            JObject jObj = new JObject();
            try
            {
                string nodeXmlData = null;
                Press3.BusinessRulesLayer.Studio studioObj = new BusinessRulesLayer.Studio();
                string nodeOption = context.Request["nodeOption"];
                resultObj = studioObj.GetStudioNodeDetails(MyConfig.MyConnectionString, accountId, Convert.ToInt32(context.Request["studioId"]), Convert.ToInt32(context.Request["nodeId"]), 1);
                if (resultObj != null)
                {
                    if (resultObj.SelectToken("Success").ToString() == "True")
                    {
                        nodeXmlData = resultObj.SelectToken(@"NodeDetails[0].MetaDataXml").ToString();

                       
                        string noID = context.Request["nodeId"];
                        string stdid = context.Request["studioId"];
                        string option_name = nodeOption.ToLower();
                        StringBuilder StrBuilder = new StringBuilder();

                        string Tts_Drop = "<select id='ttschars_" + noID + "' ></select>";
                       
                        XmlDocument xmlobj = new XmlDocument();
                        xmlobj.LoadXml(nodeXmlData);
                        XmlNode x = xmlobj.FirstChild;

                        switch (option_name)
                        {
                            case "dial extension":
                                string dial_ext_greet_play_voice = "";
                                string dial_ext_greet_spk_voice = "";
                                string dial_ext_greet_spk_text = "";
                                string dial_ext_greet_spk_display = "none";
                                string dial_ext_greet_play_url = "";
                                string dial_ext_greet_file_display = "none";
                                string dial_ext_greet_fileup = "block";

                                string dial_ext_invalid_play_voice = "";
                                string dial_ext_invalid_spk_voice = "";
                                string dial_ext_invalid_spk_text = "";
                                string dial_ext_invalid_spk_display = "none";
                                string dial_ext_invalid_play_url = "";
                                string dial_ext_invalid_file_display = "none";
                                string dial_ext_invalid_fileup = "block";

                                string dial_ext_noans_play_voice = "";
                                string dial_ext_noans_spk_voice = "";
                                string dial_ext_noans_spk_text = "";
                                string dial_ext_noans_spk_display = "none";
                                string dial_ext_noans_play_url = "";
                                string dial_ext_noans_file_display = "none";
                                string dial_ext_noans_fileup = "block";

                                string dial_ext_termination_key = "1";

                                string dial_ext_studio_xml = "";

                                foreach (XmlNode node in x.ChildNodes)
                                {
                                    //if (node.Name == "agent")
                                    //{
                                    //    cid = node.InnerText;
                                    //}
                                    if (node.Name == "greeting")
                                    {
                                        dial_ext_termination_key = node.Attributes["key"].Value;
                                        if (node.FirstChild.Name == "speak")
                                        {
                                            dial_ext_greet_play_voice = "";
                                            dial_ext_greet_spk_voice = "checked";
                                            dial_ext_greet_spk_text = node.FirstChild.InnerText;
                                            dial_ext_greet_spk_display = "block";
                                        }
                                        else
                                        {
                                            dial_ext_greet_play_voice = "checked";
                                            dial_ext_greet_spk_voice = "";
                                            dial_ext_greet_play_url = node.FirstChild.InnerText;
                                            dial_ext_greet_file_display = "block";
                                            dial_ext_greet_fileup = "none";
                                        }
                                    }
                                    else if (node.Name == "invalidext")
                                    {
                                        if (node.FirstChild.Name == "speak")
                                        {
                                            dial_ext_invalid_play_voice = "";
                                            dial_ext_invalid_spk_voice = "checked";
                                            dial_ext_invalid_spk_text = node.FirstChild.InnerText;
                                            dial_ext_invalid_spk_display = "block";
                                        }
                                        else
                                        {
                                            dial_ext_invalid_play_voice = "checked";
                                            dial_ext_invalid_spk_voice = "";
                                            dial_ext_invalid_play_url = node.FirstChild.InnerText;
                                            dial_ext_invalid_file_display = "block";
                                            dial_ext_invalid_fileup = "none";
                                        }
                                    }
                                    else if (node.Name == "noanswer")
                                    {
                                        if (node.FirstChild.Name == "speak")
                                        {
                                            dial_ext_noans_play_voice = "";
                                            dial_ext_noans_spk_voice = "checked";
                                            dial_ext_noans_spk_text = node.FirstChild.InnerText;
                                            dial_ext_noans_spk_display = "block";
                                        }
                                        else
                                        {
                                            dial_ext_noans_play_voice = "checked";
                                            dial_ext_noans_spk_voice = "";
                                            dial_ext_noans_play_url = node.FirstChild.InnerText;
                                            dial_ext_noans_file_display = "block";
                                            dial_ext_noans_fileup = "none";
                                        }
                                    }
                                }

                                JObject extResultObj = new JObject();
                                Press3.BusinessRulesLayer.Studio studioExtObj = new BusinessRulesLayer.Studio();
                                extResultObj = studioExtObj.GetStudioNodeDetails(MyConfig.MyConnectionString, accountId, Convert.ToInt32(context.Request["studioId"]), Convert.ToInt32(context.Request["nodeId"]), 2);

                                if (extResultObj != null)
                                {
                                    if (extResultObj.SelectToken("Success").ToString() == "True")
                                    {
                                        dial_ext_studio_xml = extResultObj.SelectToken(@"NodeDetails[0].MetaDataXml").ToString();
                                    }
                                    else {
                                        return extResultObj;
                                    }
                                }
                                else
                                {
                                    return extResultObj;
                                }


                                XmlDocument std_xml_doc = new XmlDocument();
                                std_xml_doc.LoadXml(dial_ext_studio_xml);
                                XmlNode dial_ext_first_node = std_xml_doc.FirstChild;


                                string dial_ext_keys = "";
                                ArrayList dial_ext_key_arr = new ArrayList();
                                ArrayList dial_ext_key_value = new ArrayList();
                                ArrayList dial_ext_keytexts = new ArrayList();

                                ArrayList dial_ext_keynodes = new ArrayList();
                                JObject dial_ext_child_nodes = default(JObject);
                                JArray dial_ext_childtextsnodes = new JArray();
                                //keys = x.Attributes["validkeys"].Value.Trim();

                                foreach (XmlNode node in dial_ext_first_node.ChildNodes)
                                {
                                    if (node.Name == "node" && node.Attributes["nodeContent"].Value.ToLower() == "dial extension" && node.Attributes["nodeId"].Value == noID)
                                    {
                                            string childnodes = "{" + node.Attributes["childNodes"].Value + "}";
                                            dial_ext_child_nodes = new JObject();
                                            dial_ext_child_nodes = JObject.Parse(childnodes);
                                            //dial_ext_child_nodes.Add("nodeId", node.Attributes["nodeId"].Value);
                                    }
                                }

                                StrBuilder.Clear();
                                StrBuilder.Append("<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button><h4 class='bold-6 font-blue'>Dial extension</h4></div>");
                                StrBuilder.Append("<div class='modal-body'><div class='module-error'></div>");
                                StrBuilder.Append("<h5 class='txt-grey bold-6 f_15'>Greeting Message</h5>");
                                StrBuilder.Append("<div class='greeting module-left'>");
                                StrBuilder.Append("<label class='margin-right-20' ><input type='radio' "+ dial_ext_greet_play_voice +" class='greeting_rd' name='greeting_play_option_" + noID + "' nodeid=" + noID + " parent='greeting' value='file'/> Upload clip</label>");
                                StrBuilder.Append("<label><input type='radio' "+ dial_ext_greet_spk_voice +" class='greeting_rd' name='greeting_play_option_" + noID + "' nodeid=" + noID + " parent='greeting' value='text'/> Text message </label>");
                                StrBuilder.Append("<div class='clear'></div>");
                                StrBuilder.Append("<div ID='fileupload_div_GttMsg'>");
                                StrBuilder.Append("<div class='uploadfile' nodeid='" + noID + "' path='" + dial_ext_greet_play_url + "' style='display:" + dial_ext_greet_file_display + ";'>");
                                StrBuilder.Append("<div class='audio_player' nodeid='" + noID + "' style='display:" + dial_ext_greet_file_display + ";'>");
                                StrBuilder.Append("<div class='player'><audio controls><source src='" + dial_ext_greet_play_url + "'>Your browser does not support the audio element.</audio></div><a href='#' class='uploadnew' style='float:none;'>Upload new</a></div>");
                                StrBuilder.Append("<input type=hidden name='file_element' value='greeting_play_option'/><input class='flUpload_GttMsg' nodeid='" + noID + "' type='file' name='files[]' multiple='' style='display:" + dial_ext_greet_fileup + ";'></div></div>");
                                StrBuilder.Append("<div class='textmessage' style='display:" + dial_ext_greet_spk_display + ";'>");
                                StrBuilder.Append("<div id='greet_msg'><select class='ddl_lang form-control input-inline margin-right-5' parent1='greet_conv' nodeid='" + noID + "'><option lid='1' sid='1' value='1'>English</option> </select><textarea id='txt_msg' class='form-control input-inline'>"+ dial_ext_greet_spk_text +"</textarea></div>");
                                StrBuilder.Append("<div class='greet_conv' style='display:none'><input type='button' class='btn blue btn_convert' name='greet_msg' value='convert' /></div>");
                                StrBuilder.Append("</div><div class='clear'></div></div>");
                                StrBuilder.Append("<div class='margin-top-15'><label class='margin-right-10'>Extension input followed by :</label><label><select class='ExtTerminationKey' nodeid='" + noID + "'>");
                                if (dial_ext_termination_key == "*"){
                                    StrBuilder.Append("<option value='1' selected>*</option><option value='2'>#</option>");
                                }else {
                                    StrBuilder.Append("<option value='1'>*</option><option value='2' selected>#</option>");
                                }
                                StrBuilder.Append("</select></label></div>");
                                StrBuilder.Append("<h5 class='txt-grey bold-6 f_15'>Invalid Extension</h5>");
                                StrBuilder.Append("<div class='InvalidExt module-left'>");
                                StrBuilder.Append("<label class='margin-right-20' ><input type='radio' "+ dial_ext_invalid_play_voice +" class='InvalidExt_rd' name='InvalidExt_play_option_" + noID + "' nodeid=" + noID + " parent='InvalidExt' value='file'/> Upload clip</label>");
                                StrBuilder.Append("<label><input type='radio' "+ dial_ext_invalid_spk_voice +" class='InvalidExt_rd' name='InvalidExt_play_option_" + noID + "' nodeid=" + noID + " parent='InvalidExt' value='text'/> Text message </label>");
                                StrBuilder.Append("<div class='clear'></div>");
                                StrBuilder.Append("<div ID='fileupload_div_InvalidExt'>");
                                StrBuilder.Append("<div class='uploadfile' nodeid='" + noID + "' path='" + dial_ext_invalid_play_url + "' style='display:" + dial_ext_invalid_file_display + ";'>");
                                StrBuilder.Append("<div class='audio_player' nodeid='" + noID + "' style='display:" + dial_ext_invalid_file_display + ";'>");
                                StrBuilder.Append("<div class='player'><audio controls><source src='" + dial_ext_invalid_play_url + "'>Your browser does not support the audio element.</audio></div>");
                                StrBuilder.Append("<a href='#' class='uploadnew' style='float:none;'>Upload new</a></div>");
                                StrBuilder.Append("<input type=hidden name='file_element' value='InvalidExt_play_option'/><input class='flUpload_InvalidExt' nodeid='" + noID + "' type='file' name='files[]' multiple='' style='display:" + dial_ext_invalid_fileup + ";'></div></div>");
                                StrBuilder.Append("<div class='textmessage' style='display:" + dial_ext_invalid_spk_display + ";'><div id='InvalidExt_msg'><select class='ddl_lang form-control input-inline margin-right-5' parent1='InvalidExt_conv' nodeid='" + noID + "'><option lid='1' sid='1' value='1'>English</option> </select><textarea id='txt_msg' class='form-control input-inline'>" + dial_ext_invalid_spk_text + "</textarea></div>");
                                StrBuilder.Append("<div class='InvalidExt_conv' style='display:none'><input type='button' class='btn blue btn_convert' name='InvalidExt_msg' value='convert' /></div>");
                                StrBuilder.Append("</div><div class='clear'></div></div>");
                                StrBuilder.Append("<div class='margin-top-15'><label class='margin-right-10'>Goto :</label><label class='steps-options invalid-key'></label></div>");
                                //StrBuilder.Append("<h5 class='txt-grey bold-6 f_15'>No Answer </h5><div class='NoAns module-left'>");
                                //StrBuilder.Append("<label class='margin-right-20' ><input type='radio' "+ dial_ext_noans_play_voice +" class='NoAns_rd' name='NoAns_play_option_" + noID + "' nodeid=" + noID + " parent='NoAns' value='file'/> Upload clip</label>");
                                //StrBuilder.Append("<label><input type='radio' "+ dial_ext_noans_spk_voice +" class='NoAns_rd' name='NoAns_play_option_" + noID + "' nodeid=" + noID + " parent='NoAns' value='text'/> Text message </label>");
                                //StrBuilder.Append("<div class='clear'></div>");
                                //StrBuilder.Append("<div ID='fileupload_div_NoAns'><div class='uploadfile' nodeid='" + noID + "' path='" + dial_ext_noans_play_url + "' style='display:" + dial_ext_noans_file_display + ";'>");
                                //StrBuilder.Append("<div class='audio_player' nodeid='" + noID + "' style='display:" + dial_ext_noans_file_display + ";'>");
                                //StrBuilder.Append("<div class='player'><audio controls><source src='" + dial_ext_noans_play_url + "'>Your browser does not support the audio element.</audio></div> <a href='#' class='uploadnew' style='float:none;'>Upload new</a></div>");
                                //StrBuilder.Append("<input type=hidden name='file_element' value='NoAns_play_option'/><input class='flUpload_NoAns' nodeid='" + noID + "' type='file' name='files[]' multiple='' style='display:" + dial_ext_noans_fileup + ";'></div></div>");
                                //StrBuilder.Append("<div class='textmessage' style='display:" + dial_ext_noans_spk_display + ";'><div id='NoAns_msg'><select class='ddl_lang form-control input-inline margin-right-5' parent1='NoAns_conv' nodeid='" + noID + "'><option lid='1' sid='1' value='1'>English</option> </select><textarea id='txt_msg' class='form-control input-inline'>" + dial_ext_noans_spk_text + "</textarea></div><div class='NoAns_conv' style='display:none'><input type='button' class='btn blue btn_convert' name='NoAns_msg' value='convert' /></div>");
                                //StrBuilder.Append("</div><div class='clear'></div></div>");
                                StrBuilder.Append("<div class='errordiv text-center margin-top-10' nodeId='" + noID + "'></div></div>");
                                StrBuilder.Append("<div class='dial_ext_nodes' nodeId='" + noID + "'>");
                             
                                foreach (var childnode in dial_ext_child_nodes)
                                {
                                    string name = childnode.Key;
                                    string value = childnode.Value.ToString();
                                    var nameNodeText = "";
                                    if (name.ToLower() == "noanswer") {
                                        nameNodeText = "No Answer";
                                    }
                                    else if (name.ToLower() == "answer")
                                    {
                                        nameNodeText = "Answer";
                                    }
                                    else if (name.ToLower() == "invalid")
                                    {
                                        nameNodeText = "Invalid Extension";
                                    }
                                    StrBuilder.Append("<span nodeId='" + value + "' name='" + nameNodeText + "' nodeText='" + childnode.Key + "' id='"+ noID +"'></span>");
                                }

                                //while (dial_ext_i < dial_ext_num)
                                //{
                                //    StrBuilder.Append("<span nodeId='" + dial_ext_child_nodes[dial_ext_i]["noanswer"].ToString() + "'></span>");
                                //}

                                StrBuilder.Append("</div><div class='modal-footer'><button type='button' class='btn green module-update' module='dial extension'>Update</button> <button type='button' data-dismiss='modal' class='btn module-cancel' module='dial extension'>Cancel</button></div></div>");
                                break;
                            case "Hang Up":
                                StrBuilder.Clear();
                                StrBuilder.Append("<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button></div>");
                                StrBuilder.Append("<div class='modal-body'> Hang up the call </div>");
                                StrBuilder.Append("<div class='modal-footer'>  <button type='button'  class='btn green module-update' module='hang up'>Update</button>  <button type='button' data-dismiss='modal' class='btn module-cancel' module='hang up'>Cancel</button></div>");
                                break;
                            case "play message":
                                string rbt_play = null;
                                string rbt_spk = null;
                                string speak_text = null;
                                string play_url = null;
                                string play_display = "none";
                                string fileup_dis = "block";
                                if (x.Name.ToString() == "play")
                                {
                                    rbt_play = "checked";
                                    rbt_spk = "";
                                    play_url = x.InnerText.ToString();
                                    play_display = "block";
                                    fileup_dis = "none";
                                }
                                else
                                {
                                    rbt_play = "";
                                    rbt_spk = "checked";
                                    speak_text = x.InnerText.ToString();
                                }
                                StrBuilder.Clear();
                                StrBuilder.Append("<div><div class='modal-header'><button aria-hidden='true' data-dismiss='modal' class='close' type='button'></button><h4 class='bold-6 font-blue'>Play Message</h4></div>");

                                StrBuilder.Append("<div class='modal-body'><ul class='module-list' style='padding:0px;'><li><input class='playMessageRadio' type='radio' " + rbt_play + " value='file' name='play_option_" + noID + "' nodeId='"+ noID +"' />");
                                StrBuilder.Append("<label class='txt-grey margin-left-5'> Upload clip</label><div ID='fileupload_div'>");
                                StrBuilder.Append("<div class='uploadfile' nodeid='" + noID + "' path='" + play_url + "' style='display:" + play_display + ";'>");
                                StrBuilder.Append("<div class='audio_player' nodeid='" + noID + "' style='display:" + play_display + ";'><div class='player'><audio controls><source src='" + play_url + "' type='audio/mpeg'>Your browser does not support the audio element.</audio></div><a href='#' class='uploadnew' style='float:none;'>Upload new</a></div><input class='flUpload_11' nodeid='" + noID + "' type='file' name='files[]' multiple style='display:" + fileup_dis + ";'></div></div>");
                                StrBuilder.Append("</li><li><input class='playMessageRadio' type='radio' " + rbt_spk + " value='text' name='play_option_" + noID + "' /><label class='txt-grey margin-left-5'> Text message</label>  <div style='margin-top: 10px;' class='textmessage'><div id='play_msg'><select class='ddl_lang form-control input-inline margin-bottom-10' parent1='play_conv' nodeid='" + noID + "'><option lid='1' sid='1' value='1'>English</option> </select><textarea class='form-control'>" + speak_text + "</textarea></div></li></ul>");
                                StrBuilder.Append("<div class='errordiv margin-top-10 text-center' nodeid='" + noID + "'></div></div><div class='modal-footer'><button module='play message' class='btn green module-update' type='button'>");
                                StrBuilder.Append("Update</button><button module='play message' class='btn module-cancel' data-dismiss='modal' type='button'>Cancel</button></div></div>");
                                break;
                            case "goto":

                                StrBuilder.Clear();
                                StrBuilder.Append("<div><div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button><h4 class='bold-6 font-blue'>Goto Your required step</h4></div><div class='modal-body'><div class='field'><label style='width:50px;float:left;margin-left:50px;'>Go to : </label>");
                                StrBuilder.Append("<div class='goto_step' style='float:left;margin-left:20px;'><div class='steps-options'></div></div></div><div class='clear'></div></div><div class='modal-footer'> <div class='errordiv left' nodeId='"+ noID +"'></div> <button type='button'  class='btn green module-update' module='goto'>Update</button>  <button type='button' data-dismiss='modal' class='btn module-cancel' module='goto'>Cancel</button></div></div>");
                                break;
                            case "menu":
                                string menu_invalid_node_id = null;
                                string keys = "";
                                ArrayList key_arr = new ArrayList();
                                ArrayList key_value = new ArrayList();
                                ArrayList keytexts = new ArrayList();
                                //dynamic key_arr = default(ArrayList);
                                //dynamic key_value = default(ArrayList);
                                //dynamic keytexts = default(ArrayList);
                                ArrayList keynodes = new ArrayList();
                                JObject child_nodes = default(JObject);
                                JArray childtextsnodes = new JArray();
                                string studio_xml = null;
                                string play1 = null;
                                string speak1 = null;
                                string ply_chk1 = null;
                                string speak_chk1 = null;
                                string play2 = null;
                                string speak2 = null;
                                string ply_chk2 = null;
                                string speak_chk2 = null;
                                string play1_display = "none";
                                string play2_display = "none";
                                string speak1_display = "none";
                                string speak2_display = "none";
                                string file1_up = "block";
                                string file2_up = "block";
                                keys = x.Attributes["validkeys"].Value.Trim();

                                JObject menuResultObj = new JObject();
                                Press3.BusinessRulesLayer.Studio studioBusinessObj = new BusinessRulesLayer.Studio();
                                menuResultObj = studioBusinessObj.GetStudioNodeDetails(MyConfig.MyConnectionString, accountId, Convert.ToInt32(context.Request["studioId"]), Convert.ToInt32(context.Request["nodeId"]), 2);

                                if (menuResultObj != null)
                                {
                                    if (menuResultObj.SelectToken("Success").ToString() == "True")
                                    {
                                        studio_xml = menuResultObj.SelectToken(@"NodeDetails[0].MetaDataXml").ToString();
                                    }
                                    else {
                                        return menuResultObj;
                                    }
                                }
                                else
                                {
                                    return menuResultObj;
                                }

                                XmlDocument std_xml = new XmlDocument();
                                std_xml.LoadXml(studio_xml);
                                XmlNode first_node = std_xml.FirstChild;
                                foreach (XmlNode node in first_node.ChildNodes)
                                {
                                    if (node.Name == "node")
                                    {
                                        foreach (char c in keys)
                                        {
                                            if (node.Attributes["nodeContent"].Value.ToLower() == "menu")
                                            {
                                                if (node.Attributes["nodeId"].Value == noID)
                                                {
                                                    string childnodes = "{" + node.Attributes["childNodes"].Value + "}";
                                                    child_nodes = new JObject();
                                                    child_nodes = JObject.Parse(childnodes);
                                                    child_nodes.Add("nodeId", node.Attributes["nodeId"].Value);
                                                    //Response.Write(childnodes)
                                                    foreach (var childnode in child_nodes)
                                                    {
                                                        string name = childnode.Key;
                                                        if (name.ToLower() == "invalid")
                                                        {
                                                            menu_invalid_node_id = childnode.Value.ToString();
                                                        }
                                                    }
                                                }
                                            }
                                            string nodekey = node.Attributes["nodeText"].Value;
                                            if (nodekey == c.ToString() && node.Attributes["p_id"].Value == noID)
                                            {
                                                string sampletext = "{'childnode':'" + node.Attributes["nodeId"].Value + "', 'childkey':'" + c + "', 'nodeid':'" + node.Attributes["p_id"].Value + "', 'childtext':'" + node.Attributes["nodeContent"].Value + "'}";
                                                childtextsnodes.Add(JObject.Parse(sampletext));
                                                key_arr.Add(c);
                                                key_value.Add(node.Attributes["nodeContent"].Value);
                                                //Response.Write(childtextsnodes)
                                            }
                                        }
                                    }
                                }

                                

                                if (x.FirstChild.Name.ToString() == "play")
                                {
                                    play1 = x.FirstChild.InnerText;
                                    ply_chk1 = "checked";
                                    speak1 = "";
                                    speak_chk1 = "";
                                    play1_display = "block";
                                    file1_up = "none";
                                }
                                else
                                {
                                    speak1 = x.FirstChild.InnerText;
                                    speak_chk1 = "checked";
                                    play1 = "";
                                    ply_chk1 = "";
                                    speak1_display = "block";
                                }
                                if (x.LastChild.Attributes["type"].Value.ToString() == "play")
                                {
                                    play2 = x.LastChild.InnerText;
                                    ply_chk2 = "checked";
                                    speak2 = "";
                                    speak_chk2 = "";
                                    play2_display = "block";
                                    file2_up = "none";
                                }
                                else
                                {
                                    speak2 = x.LastChild.FirstChild.InnerText;
                                    speak_chk2 = "checked";
                                    play2 = "";
                                    ply_chk2 = "";
                                    speak2_display = "block";
                                }
                                StrBuilder.Clear();
                                StrBuilder.Append("<div><div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button><h4 class='bold-6 font-blue'>Play the following menu option</h4></div><div class='modal-body'><h5 class='txt-grey bold-6 f_15'>Greeting Message</h5><div class='greeting module-left'>");
                                StrBuilder.Append("<input type=hidden name='callback' value= '' /><label class='margin-right-20' ><input " + ply_chk1 + " type='radio' class='greeting_rd' name='greeting_play_option_" + noID + "' nodeid=" + noID + " parent='greeting' value='file'/> Upload clip</label><label><input " + speak_chk1 + " type='radio' class='greeting_rd' name='greeting_play_option_" + noID + "' nodeid=" + noID + " parent='greeting' value='text'/> Text message </label>");
                                StrBuilder.Append("<div class='clear'></div><div ID='fileupload_div_GttMsg'><div class='uploadfile' nodeid='" + noID + "' style='display:" + play1_display + ";' path='" + play1 + "'><div class='audio_player' nodeid='" + noID + "' style='display:" + play1_display + ";'><div class='player'><audio controls><source src='" + play1 + "'>Your browser does not support the audio element.</audio></div><a href='#' class='uploadnew' nodeid='" + noID + "' style='float:none;'>Upload new</a></div><input class='flUpload_GttMsg' nodeid='" + noID + "' type='file' name='files[]' multiple='' style='display:" + file1_up + ";' /></div></div>");
                                StrBuilder.Append("<div class='textmessage' style='display:" + speak1_display + ";'><div id='greet_msg'><select class='ddl_lang form-control input-inline margin-right-5' parent1='greet_conv' nodeid='" + noID + "'><option lid='1' sid='1' value='1'>English</option></select><textarea id='txt_msg' class='form-control input-inline'>" + speak1 + "</textarea></div><div class='greet_conv' style='display:none'><input type='button' class='btn blue btn_convert' name='greet_msg' value='convert' /></div></div><div class='clear'></div><h5 class='txt-lite-grey bold-6 margin-top-15'>key options</h5><div class='module-left'><div class='menu-option-head'><div class='opt'>Key</div><div class='opt_val'>Key Value </div><button type='button' class='btn btn-default btn-sm addmore font-green' style='display:none;'><i class='icon-plus font-green'></i> Add New</button></div><div class='clear'></div>");
                                int i = 0;
                                int num = childtextsnodes.Count;
                                while (i < num)
                                {
                                    if (Convert.ToInt32(childtextsnodes[i]["nodeid"].ToString()) == Convert.ToInt32(noID))
                                    {
                                        StrBuilder.Append("<div class='menu-option' nodeid='" + childtextsnodes[i]["childnode"].ToString() + "'><input type='text' class='opt form-control' value ='" + childtextsnodes[i]["childkey"].ToString() + "' disabled /><input type='text' class='opt_val form-control' value = '" + childtextsnodes[i]["childtext"].ToString() + "'  disabled/></div><div class='clear'></div>");
                                    }
                                    i = i + 1;
                                }

                                StrBuilder.Append("</div></div><h5 class='txt-grey bold-6 f_15'>Invalid key </h5><div class='invalid-key module-left' nodeid='" + noID + "' invalid-node-id='" + menu_invalid_node_id + "'><p>Play 'invalid key' message </p>");
                                StrBuilder.Append("<label class='margin-right-20'><input " + ply_chk2 + " type='radio' class='invalid_rd' name='invalid_play_option_" + noID + "' nodeid=" + noID + " parent='invalid-key' value='file'/> Upload clip</label><label><input " + speak_chk2 + " type='radio' class='invalid_rd' name='invalid_play_option_" + noID + "' nodeid=" + noID + " parent='invalid-key' value='text'/> Text message</label><div class='clear'></div><div class='textmessage' style='display:" + speak2_display + "'><div id='invalid_msg'><select class='ddl_lang1 form-control input-inline margin-right-5' parent1='invalid_conv' nodeid='" + noID + "'><option lid='1' sid='1' value='1'>English</option> </select><textarea id='txt_msg1' class='form-control input-inline'>" + speak2 + "</textarea></div><div class='invalid_conv' style='display:none'><input type='button' class='btn blue btn_convert' name='invalid_msg' value='convert' /></div><div id='div_vclips1'></div></div>");
                                StrBuilder.Append("<div class='clear'></div><div ID='fileupload_div_InvalidKey'><div class='uploadfile' nodeid='" + noID + "' style='display:" + play2_display + ";' path='" + play2 + "'><div class='audio_player' nodeid='" + noID + "' style='display:" + play2_display + ";'  path='" + play2 + "'><div class='player'><audio controls><source src='" + play2 + "'>Your browser does not support the audio element.</audio></div><a href='#' class='uploadnew' nodeid='" + noID + "' style='float:none;'>Upload new</a></div><input class='flUpload_InvalidKey' nodeid='" + noID + "' type='file' name='files[]' multiple='' style='display:" + file2_up + ";'></div></div>");
                                StrBuilder.Append("<div class='margin-top-15'><label class='margin-right-10'>Goto :</label><label class='steps-options invalid-key'></label></div></div><div class='errordiv text-center margin-top-10 f_13 margin-bottom-15' nodeId='" + noID + "'></div></div><div class='modal-footer'><button type='button'  class='btn green module-update' module='menu'>Update</button><button type='button' data-dismiss='modal' class='btn module-cancel' module='menu'>Cancel</button></div></div><input type='hidden' id='hdn_invalid_id' />");
                                break;
                            case "ring user(s)":
                                DataSet skillGroupds = new DataSet();
                                List<int> cids = new List<int>();
                                var skillGroupIdSelected = "";
                                //var cids = 0;
                                string rsg = "";
                                string hold_clip = "";
                                string display_hold_clip = "none";
                                string wait_fileup = "block";
                                foreach (XmlNode node in x.ChildNodes)
                                {
                                    if (node.Name == "skillgroupids")
                                    {

                                       skillGroupIdSelected = node.InnerText;
                                       cids = node.InnerText.Split(',').Select(Int32.Parse).ToList();
                                        
                                        //cids.Add(Convert.ToInt32(node.InnerText.Split(new char[] { "," }, StringSplitOptions.RemoveEmptyEntries)));
                                    }
                                    //else if (node.Name == "times")
                                    //{
                                    //    r_time = node.InnerText;
                                    //}
                                    else if (node.Name == "ringstrategy")
                                    {
                                        rsg = node.InnerText;
                                    }
                                    //else if (node.Name == "message")
                                    //{
                                    //    msg = node.InnerText;
                                    //}
                                    //else if (node.Name == "voicemail")
                                    //{
                                    //    vmail = 2;
                                    //    vemail = node.FirstChild.InnerText;
                                    //}
                                    else if (node.Name == "waitclip")
                                    {
                                        hold_clip = node.InnerText;
                                        display_hold_clip = "block";
                                        wait_fileup = "none";
                                    }
                                    //else if (node.Name == "agentlogin")
                                    //{
                                    //    login = node.FirstChild.InnerText;
                                    //}
                                }

                                //if (login == "Yes")
                                //{
                                //    ylog = "checked";
                                //    nlog = "";
                                //}
                                //else
                                //{
                                //    nlog = "checked";
                                //    ylog = "";
                                //}

                                try
                                {
                                    skillGroupds = GetSkillGroupsDs(context);
                                }
                                catch (Exception ex)
                                {
                                    Logger.Error(ex.ToString());
                                    resultObj = new JObject(new JProperty("Status", 0), new JProperty("ErrorReason", "Something Wrong With The Server"));
                                    return resultObj;
                                }
                                StringBuilder selectedStrBulider = new StringBuilder();
                                selectedStrBulider.Clear();
                                selectedStrBulider.Append("<div class='right'><div class='selected-agents'><ul class='sortable-list'>");
                                StrBuilder.Clear();
                                StrBuilder.Append("<div class='ring'><div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button><h4 class='bold-6 font-blue'>Ring - Skill Groups</h4></div><div class='modal-body'><div class='alert alert-error hide'><span></span></div><div style='margin-bottom:5px;' class='div_select_agent'><div class='margin-bottom-5 txt-grey'>Select Skillgroup(s):</div>");
                                
                                StrBuilder.Append("<select class='skillGroupclass form-control' id='selSkillGroup_" + noID + "' nodeid='" + noID + "'>");

                                if (skillGroupds.Tables[0].Rows.Count > 0)
                                {
                                    for (int j = 0; j < skillGroupds.Tables[0].Rows.Count; j++)
                                    {

                                        StrBuilder.Append("<option value='" + skillGroupds.Tables[0].Rows[j]["Id"].ToString() + "' " + (skillGroupIdSelected.Equals(skillGroupds.Tables[0].Rows[j]["Id"].ToString()) ? "selected='true'" : "") + " value='linear'>" + skillGroupds.Tables[0].Rows[j]["Name"].ToString() + "</option>");
                                    }
                                }


                                StrBuilder.Append("</select>");

                                StrBuilder.Append("<div class='div_ringstragery' style='margin-top:20px;margin-bottom:20px;'><div class='margin-bottom-5 txt-grey'>Ringgroup Strategy:</div>");
                                //if (cids.Count > 1)
                                //{
                                StrBuilder.Append("<select class='ringstrategy form-control' nodeid='" + noID + "'>");
                                //}
                                //else
                                //{
                                //    StrBuilder.Append("<select class='ringstrategy' disabled=true  class='disabled'>");
                                //}
                                StrBuilder.Append("<option " + (rsg.Equals("linear") ? "selected='true'" : "") + " value='linear'>Linear Call Distribution</option>");
                                StrBuilder.Append("<option " + (rsg.Equals("simultaneous") ? "selected='true'" : "") + " value='simultaneous'>Simultaneous Call Distribution</option>");
                                StrBuilder.Append("<option " + (rsg.Equals("circular") ? "selected='true'" : "") + " value='circular'>Circular Call Distribution</option>");
                                StrBuilder.Append("<option " + (rsg.Equals("uniform") ? "selected='true'" : "") + " value='uniform'>Uniform Call Distribution</option>");
                                StrBuilder.Append("</select></div>");
                                StrBuilder.Append("<div id='selRingText_" + noID + "' style='border:1px solid #ccc;padding:5px;'>Calls will be distributed in order, starting at the beginning each time.</div>");
                                StrBuilder.Append("<label style='margin-top:20px;'>Wait Clip:</label>");
                                StrBuilder.Append("<div id='fileupload_div'><div class='uploadfile' path='" + hold_clip + "' nodeid='" + noID + "'>");
                                StrBuilder.Append("<div class='audio_player' nodeid='" + noID + "' style='display:" + display_hold_clip + ";'><div class='player'><audio controls><source src='" + hold_clip + "'>Your browser does not support the audio element.</audio></div><a href='#' class='uploadnew' style='margin-top:-30px;float:none;'>Upload new</a></div><input class='flUpload_11' nodeid='" + noID + "' type='file' name='files[]' multiple style='display:" + wait_fileup + ";'></div><div class='errordiv text-center margin-top-10' nodeid='" + noID + "'></div></div>");
                                StrBuilder.Append("<div class='modal-footer' style='margin-top:20px;'><button type='button'  class='btn green module-update' module='ring user(s)'>Update</button><button type='button' data-dismiss='modal' class='btn module-cancel' module='ring user(s)'>Cancel</button></div></div>");
                                break;
                            case "time of the day":
                            DataSet timeslotds = new DataSet();
                        try
                        {
                            timeslotds = GetTimeSlots(context);
                            if (timeslotds != null)
                            {
                                if (timeslotds.Tables.Count > 0)
                                {
                                    if (timeslotds.Tables[0].Rows.Count > 0)
                                    {
                                        StrBuilder.Clear();
                                        StrBuilder.Append("<div class='modal-header'>");
                                        StrBuilder.Append("<button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button>");
                                        StrBuilder.Append("<h4 class='modal-title bold font-blue-soft'>Route Calls according to the time of the day</h4>");
                                        StrBuilder.Append("</div>");
                                        StrBuilder.Append("<div class='modal-body f_13 ringUserDet' id='ringUserDet_"+ noID +"'>");

                                        int timeSlotsCount = 0;

                                        foreach (XmlNode node in x.ChildNodes)
                                        {
                                            if (node.Name == "slot")
                                            {
                                                int dynSlot = (timeSlotsCount + 1);
                                                StrBuilder.Append("<div class='form-group TimeSlotCounts' id='TimeSlotCount_" + noID + "' ><label class='label-head blocked'>Select Time Frame " + dynSlot + "</label>");
                                                StrBuilder.Append("<select class='form-control input-inline selTimeSlots' timeSlotNo='" + dynSlot + "' id='selTimeSlot_" + noID + "_" + dynSlot +"'  nodeId='" + noID + "'>");
                                                //StrBuilder.Append("<option value='0'>Select Timeslot</option>");

                                                for (int k = 0; k < timeslotds.Tables[0].Rows.Count; k++)
                                                {
                                                    if (node.InnerText.Equals(timeslotds.Tables[0].Rows[k]["Id"].ToString())){
                                                        StrBuilder.Append("<option " + (node.InnerText.Equals(timeslotds.Tables[0].Rows[k]["Id"].ToString()) ? "selected='true'" : "") + "  value='" + timeslotds.Tables[0].Rows[k]["Id"].ToString() + "'>" + timeslotds.Tables[0].Rows[k]["Name"].ToString().ToString() + "</option>");
                                                    }
                                                }

                                                StrBuilder.Append("</select>");
                                                StrBuilder.Append("<a class='margin-left-5 viewTimeSlots' id='viewTimeSlot_" + noID + "_"+ dynSlot +"' timeSlotNo='"+ dynSlot+"' nodeId='" + noID + "'>View</a>");
                                                //if (timeSlotsCount > 0)
                                                //{
                                                //    StrBuilder.Append("<a class='margin-left-5 delTimeSlots' id='delTimeSlot_" + noID + "_" + dynSlot + "' delSlotNo='" + dynSlot + "' nodeId='" + noID + "'>Delete</a>");
                                                //}
                                                StrBuilder.Append("</div>");
                                                timeSlotsCount += 1;
                                            }
                                        }
                                        
                                       // StrBuilder.Append("<div class='form-group text-center'>");
                                       // StrBuilder.Append("<a class='font-green addTimeSlots' nodeId='" + noID + "' id='addTimeSlot_" + noID + "' ><i class='fa fa-plus margin-right-5'></i> Add New Time Frame</a></div>");
                                        StrBuilder.Append("<div class='well well-sm well-grey brd pad-15' id='viewTiming_" + noID + "' style='display:none;'>");
                                        StrBuilder.Append("<label><span class='label-head margin-right-10' id='slotName_" + noID + "'></label>");
                                        StrBuilder.Append("<hr style='border-color:#a5c4d0;' />");
                                        StrBuilder.Append("<div class='table-responsive'><table class='table no-border'>");
                                        StrBuilder.Append("<thead><tr><th class='bold-6'>Day</th><th class='bold-6'>Time</th></tr></thead>");
                                        StrBuilder.Append("<tbody id='showTimings_" + noID + "'></tbody></table></div></div></div>");
                                        StrBuilder.Append("<div class='modal-footer'><div class='errordiv left' nodeId='" + noID + "'></div> ");
                                        StrBuilder.Append("<button type='button' class='btn green module-update' module='time of the day' >Update</button>");
                                        StrBuilder.Append("<button type='button' data-dismiss='modal' class='btn module-cancel' module='time of the day' >Cancel</button>");
                                        StrBuilder.Append("</div>");
                                    }
                                    else
                                    {
                                        StrBuilder.Append("<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button><h4 class='modal-title bold font-blue-soft'>Route Calls according to the time of the day</h4></div>");
                                        StrBuilder.Append("<div class='modal-body'>No Timeslots available</div>");
                                        resultObj = new JObject(new JProperty("Status", 2), new JProperty("Data", StrBuilder.ToString()));
                                        return resultObj;
                                    }
                                }
                                else
                                {
                                    StrBuilder.Append("<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button><h4 class='modal-title bold font-blue-soft'>Route Calls according to the time of the day</h4></div>");
                                    StrBuilder.Append("<div class='modal-body'>No Timeslots available</div>");
                                    resultObj = new JObject(new JProperty("Status", 2), new JProperty("Data", StrBuilder.ToString()));
                                    return resultObj;
                                }
                            }
                            else
                            {
                                StrBuilder.Append("<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button><h4 class='modal-title bold font-blue-soft'>Route Calls according to the time of the day</h4></div>");
                                StrBuilder.Append("<div class='modal-body'>No Timeslots available</div>");
                                resultObj = new JObject(new JProperty("Status", 2), new JProperty("Data", StrBuilder.ToString()));
                                return resultObj;
                            }
                        }
                        catch (Exception ex)
                        {
                            Logger.Error(ex.ToString());
                            resultObj = new JObject(new JProperty("Status", 0), new JProperty("ErrorReason", "Something Wrong With The Server"));
                            return resultObj;
                        }
                                break;
                            case "voice mail":
                                //int cid = 0;
                                int smsTempId = 0;
                                int emailTempId = 0;
                                string rbt_play_voice = "";
                                string rbt_spk_voice = "";
                                string sms_chk = "";
                                string grt_speak_text = null;
                                string grt_play_url = null;
                                string tks_speak_text = null;
                                string tks_play_url = null;
                                string rct_play = null;
                                string rct_spk = null;
                                string ema_display_voice = "none";
                                string sms_display_voice = "none";
                                string ema_chk_voice = "";
                                string grt_file_display = "none";
                                string tks_file_display = "none";
                                string grt_fileup = "block";
                                string tks_fileup = "block";
                                string beepSound = null;
                                string finishOnKey = "";
                                string recordTimeOut = "";
                                List<string> sendToMembers = new List<string> ();

                                foreach (XmlNode node in x.ChildNodes)
                                {
                                    //if (node.Name == "agent")
                                    //{
                                    //    cid = node.InnerText;
                                    //}
                                    if (node.Name == "greeting")
                                    {
                                        if (node.FirstChild.Name == "speak")
                                        {
                                            rbt_play_voice = "";
                                            rbt_spk_voice = "checked";
                                            grt_speak_text = node.FirstChild.InnerText;
                                        }
                                        else
                                        {
                                            rbt_play_voice = "checked";
                                            rbt_spk_voice = "";
                                            grt_play_url = node.FirstChild.InnerText;
                                            grt_file_display = "block";
                                            grt_fileup = "none";
                                        }
                                    }
                                    else if (node.Name == "thanks")
                                    {
                                        if (node.FirstChild.Name == "tspeak")
                                        {
                                            rct_play = "";
                                            rct_spk = "checked";
                                            tks_speak_text = node.FirstChild.InnerText;
                                        }
                                        else
                                        {
                                            rct_play = "checked";
                                            rct_spk = "";
                                            tks_play_url = node.FirstChild.InnerText;
                                            tks_file_display = "block";
                                            tks_fileup = "none";
                                        }
                                    }
                                    else if (node.Name == "beepSound")
                                    {
                                        beepSound = node.InnerText;
                                    }
                                    else if (node.Name == "finishOnKey")
                                    {
                                        finishOnKey = node.InnerText;
                                    }
                                    else if (node.Name == "timeout")
                                    {
                                        recordTimeOut = node.InnerText;
                                    }
                                    else if (node.Name == "sendTo")
                                    {
                                        sendToMembers = node.InnerText.Split(',').ToList();
                                    }
                                    else if (node.Name == "smsTemplate")
                                    {
                                        sms_chk = "checked";
                                        smsTempId = Convert.ToInt32(node.InnerText);
                                        sms_display_voice = "block";
                                    }
                                    else if (node.Name == "emailTemplate")
                                    {
                                        emailTempId = Convert.ToInt32(node.InnerText);
                                        ema_chk_voice = "checked";
                                        ema_display_voice = "block";
                                    }
                                }

                        DataSet emailTmpds = new DataSet();
                        try
                        {
                            emailTmpds = GetEmailOrSmsTemplates(context, 1, 0);
                        }
                        catch (Exception ex)
                        {
                            Logger.Error(ex.ToString());
                            resultObj = new JObject(new JProperty("Status", 0), new JProperty("ErrorReason", "Something Wrong With The Server"));
                            return resultObj;
                        }
                        DataSet smsTmpds = new DataSet();
                        try
                        {
                            smsTmpds = GetEmailOrSmsTemplates(context, 2, 0);
                        }
                        catch (Exception ex)
                        {
                            Logger.Error(ex.ToString());
                            resultObj = new JObject(new JProperty("Status", 0), new JProperty("ErrorReason", "Something Wrong With The Server"));
                            return resultObj;
                        }
                                
                            StrBuilder.Clear();
                            StrBuilder.Append("<div><div class='modal-header'> <button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button> <h4 class='bold-6 font-blue'>Send the call to voice mail of user ..</h4></div>");
                            StrBuilder.Append("<div class='modal-body'><div class='module-error'></div><div class='clear'></div>");
                            StrBuilder.Append("<ul class='module-list' style='padding:0px;'><li><h5 class='f_15 txt-grey bold-6'>Greeting message</h5></li>");
                            StrBuilder.Append("<li class='greeting'><label class='margin-right-20' ><input " + rbt_play_voice + " type='radio' name='greeting_play_option_" + noID + "' class='greeting_rd' nodeid='" + noID + "' parent='greeting' value='file'/> Upload clip</label><label><input  " + rbt_spk_voice + " type='radio' name='greeting_play_option_" + noID + "' class='greeting_rd' nodeid='" + noID + "' parent='greeting' value='text'/> Text message </label><div class='clear'></div>");
                            StrBuilder.Append("<div ID='fileupload_div_GttMsg'><div class='uploadfile' nodeid='" + noID + "' path='" + grt_play_url + "' style='display:" + grt_file_display + ";'>");
                            StrBuilder.Append("<div class='audio_player' nodeid='" + noID + "' style='display:" + grt_file_display + ";'>");
                            StrBuilder.Append("<div class='player'><audio controls><source src='" + grt_play_url + "'>Your browser does not support the audio element.</audio></div>");
                            StrBuilder.Append("<a href='#' class='uploadnew' style='float:none;'>Upload new</a></div>");
                            StrBuilder.Append("<input type=hidden name='file_element' value='greeting_play_option'/><input class='flUpload_GttMsg' nodeid='" + noID + "' type='file' name='files[]' multiple='' style='display:" + grt_fileup + ";'></div></div>");
                                if (rbt_spk_voice == "checked")
                                {
                                    StrBuilder.Append("<div class='textmessage' ><textarea class='form-control'>" + grt_speak_text + "</textarea></div>");
                                }
                                else
                                {
                                    StrBuilder.Append("<div class='textmessage' style='display:none;'><textarea class='form-control'>" + grt_speak_text + "</textarea></div>");
                                }
                                StrBuilder.Append("</li><li><hr><h5 class='txt-grey f_15 bold-6'>Thanks Message</h5></li><li class='thanks'> <label class='margin-right-20' ><input " + rct_play + " type='radio' name='thanks_play_option_" + noID + "' class='thanks_rd' nodeid='" + noID + "' parent='thanks' value='file'/> Upload clip</label> <label><input " + rct_spk + " type='radio' name='thanks_play_option_" + noID + "' class='thanks_rd' nodeid='" + noID + "' parent='thanks' value='text'/> Text message</label> <div class='clear'></div><div id='fileupload_div_thnksMsg'> <div class='uploadfile' nodeid='" + noID + "' path='" + tks_play_url + "' style='display:" + tks_file_display + ";'><div class='audio_player' nodeid='" + noID + "' style='display:" + tks_file_display + ";'><div class='player'><audio controls><source src='" + tks_play_url + "'>Your browser does not support the audio element.</audio></div><a href='#' class='uploadnew' style='float:none;'>Upload new</a></div> <input type=hidden name='file_element' value='thanks_play_option'/><input class='flUpload_thksMsg' nodeid='" + noID + "' type='file' name='files[]' multiple='' style='display:" + tks_fileup + ";'></div></div>");
                                if (rct_spk == "checked")
                                {
                                    StrBuilder.Append("<div class='textmessage' > <textarea class='form-control'>" + tks_speak_text + "</textarea> </div>");
                                }
                                else
                                {
                                    StrBuilder.Append("<div class='textmessage' style='display:none;'> <textarea>" + tks_speak_text + "</textarea> </div>");
                                }
                            StrBuilder.Append("</li>");
                            StrBuilder.Append("<li><hr><label class='margin-right-15'>Play beep sound before starting recording ");

                            StrBuilder.Append("<label class='margin-right-10'><input name='RecordBeep' nodeId='" + noID + "' chkId='Yes' " + (beepSound.Equals("Yes") ? "checked='true'" : "") + " type='radio'> Yes </label>");
                            StrBuilder.Append("<label class='margin-right-10'><input name='RecordBeep' nodeId='" + noID + "' chkId='No' " + (beepSound.Equals("No") ? "checked='true'" : "") + " type='radio'> No </label>");
                            StrBuilder.Append("</label></li>");
                            StrBuilder.Append("<li><label class='margin-right-15'>Finish recording on press key </label> <label class='margin-right-10'>  <input class='FinishOnKey form-control input-inline' nodeId='" + noID + "' id='FinishOnKeyVal_" + noID + "' maxlength='1' type='text' value='" + finishOnKey + "'></label></li>");
                            StrBuilder.Append("<li><label class='margin-right-15'>Max recording time limit </label> <label class='margin-right-10'> <input class='RecordClipTime form-control input-inline' nodeId='" + noID + "' id='RecordClipTime_" + noID + "' maxlength='2' type='text' value='" + recordTimeOut + "'> sec </label></li>");
                            StrBuilder.Append("<li><hr><h5 class='txt-grey bold-6 f_15'>Notifications </h5></li>");
                            StrBuilder.Append("<li><h5 class='bold-6'>Send To: </h5></li>");
                            StrBuilder.Append("<li><label class='margin-left-15'><input type=checkbox class='sendNotificationsTo' nodeId='" + noID + "' chkName='Agent' " + (sendToMembers.Contains("Agent") ? "checked='true'" : "") + " /> Agent </label></li>");
                            StrBuilder.Append("<li><label class='margin-left-15'><input type=checkbox class='sendNotificationsTo' nodeId='" + noID + "' chkName='Supervisor' " + (sendToMembers.Contains("Supervisor") ? "checked='true'" : "") + " /> Supervisor </label></li>");
                            StrBuilder.Append("<li><label class='margin-left-15'><input type=checkbox class='sendNotificationsTo' nodeId='" + noID + "' chkName='Manager' " + (sendToMembers.Contains("Manager") ? "checked='true'" : "") + " /> Manager </label></li>");
                            StrBuilder.Append("<li><h5 class='bold-6'>Type of notifications: </h5></li>");
                            StrBuilder.Append("<li><label class='margin-left-15'><input type=checkbox class='sms-chk' nodeId='" + noID + "' " + sms_chk + " /> SMS </label></li>");
                            StrBuilder.Append("<li class='voiceSmsTemplate' id='smsTemplate_" + noID + "' nodeId='" + noID + "' style='display:" + sms_display_voice + ";padding-left: 15px;'>Choose template <select class='form-control' nodeId='" + noID + "' id='chkSms_" + noID + "'>");
                            if (smsTmpds.Tables.Count > 1)
                            {
                                if (smsTmpds.Tables[0].Rows.Count > 0)
                                {
                                    StrBuilder.Append("<option value='0'>Select Template</option>");
                                    for (int j = 0; j < smsTmpds.Tables[0].Rows.Count; j++)
                                    {
                                        StrBuilder.Append("<option " + (smsTempId.Equals(smsTmpds.Tables[0].Rows[j]["Id"]) ? "selected='true'" : "") + " value=" + smsTmpds.Tables[0].Rows[j]["Id"] + ">" + smsTmpds.Tables[0].Rows[j]["TemplateName"] + "</option>");
                                    }
                                }
                                else
                                {
                                    StrBuilder.Append("<option value='0'>No Templates</option>");
                                }
                            }
                            else
                            {
                                StrBuilder.Append("<option value='0'>No Templates</option>");
                            }
                            
                            StrBuilder.Append("</select></li>");
                            StrBuilder.Append("<li><label class='margin-left-15'><input type=checkbox class='email-chk' nodeId='" + noID + "' " + ema_chk_voice + " /> Email with voice mail recording </label> </li>");
                            StrBuilder.Append("<li class='voiceEmailTemplate' id='emailTemplate_" + noID + "' nodeId='" + noID + "' style='display:" + ema_display_voice + ";padding-left: 15px;'>Choose template <select class='form-control' nodeId='" + noID + "' id='chkEmail_" + noID + "'>");
                            if (emailTmpds.Tables.Count > 1)
                            {
                                if (emailTmpds.Tables[0].Rows.Count > 0)
                                {
                                    StrBuilder.Append("<option value='0'>Select Template</option>");
                                    for (int j = 0; j < emailTmpds.Tables[0].Rows.Count; j++)
                                    {
                                        StrBuilder.Append("<option " + (emailTempId.Equals(emailTmpds.Tables[0].Rows[j]["Id"]) ? "selected='true'" : "") + " value=" + emailTmpds.Tables[0].Rows[j]["Id"] + ">" + emailTmpds.Tables[0].Rows[j]["TemplateName"] + "</option>");
                                    }
                                }
                                else
                                {
                                    StrBuilder.Append("<option value='0'>No Templates</option>");
                                }
                            }
                            else
                            {
                                StrBuilder.Append("<option value='0'>No Templates</option>");
                            }
                            StrBuilder.Append("</select></li>");
                            StrBuilder.Append("</ul><div class='errordiv text-center margin-top-10' nodeId='" + noID + "'></div></div>");
                            StrBuilder.Append("<div class='modal-footer'><button type='button' class='btn green module-update' module='voice mail'>Update</button> <button type='button' data-dismiss='modal' class='btn module-cancel' module='voice mail'>Cancel</button></div></div>");
                                break;
                            case "email":
                                DataSet emailds = new DataSet();
                                try
                                {
                                    emailds = GetEmailOrSmsTemplates(context, 1, 0);
                                    if (emailds != null)
                                    {
                                        if (emailds.Tables.Count > 1)
                                        {
                                            if (emailds.Tables[0].Rows.Count > 0)
                                            {
                                                StrBuilder.Clear();
                                                string emailTo = null, emailCc = null, emailToRole = null, emailCcRole = null;
                                                int templateId = 0;
                                                foreach (XmlNode node in x.ChildNodes)
                                                {
                                                    if (node.Name == "to")
                                                    {
                                                        emailToRole = node.Attributes["role"].Value;
                                                        emailTo = node.InnerText;
                                                    }
                                                    else if (node.Name == "cc")
                                                    {
                                                        emailCcRole = node.Attributes["role"].Value;
                                                        emailCc = node.InnerText;
                                                    }
                                                    else if (node.Name == "template")
                                                    {
                                                        templateId = Convert.ToInt32(node.InnerText);
                                                    }
                                                }

                                                StrBuilder.Clear();
                                                StrBuilder.Append("<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button><h4 class='font-blue bold-6 mb-0'>Email</h4></div>");
                                                StrBuilder.Append("<div class='modal-body'><table class='table no-border'>");
                                                StrBuilder.Append("<tr><td class='col-sm-1'><label class='txt-grey'>To</label></td>");
                                                StrBuilder.Append("<td><select id='selEmailTo_" + noID + "' class='form-control selEmailTo' nodeId='" + noID + "'>");
                                                StrBuilder.Append("<option " + (emailToRole.Equals("Caller") ? "selected='true'" : "") + ">Caller</option>");
                                                StrBuilder.Append("<option " + (emailToRole.Equals("Agent") ? "selected='true'" : "") + ">Agent</option>");
                                                StrBuilder.Append("<option " + (emailToRole.Equals("Supervisor") ? "selected='true'" : "") + ">Supervisor</option>");
                                                StrBuilder.Append("<option " + (emailToRole.Equals("Manager") ? "selected='true'" : "") + ">Manager</option>");
                                                StrBuilder.Append("<option " + (emailToRole.Equals("Other") ? "selected='true'" : "") + ">Other</option></select></td>");
                                                if (emailToRole == "Other")
                                                {
                                                    StrBuilder.Append("<td><input type='text' class='form-control' placeholder='Enter email addresses seperated by a comma' value='" + emailTo + "' id='txtEmailToOther_" + noID + "' /></td>");
                                                }
                                                else
                                                {
                                                    StrBuilder.Append("<td><input type='text' class='form-control' placeholder='Enter email addresses seperated by a comma' id='txtEmailToOther_" + noID + "' style='display:none;' /></td>");
                                                }
                                                StrBuilder.Append("</tr>");
                                                StrBuilder.Append("<tr style='margin-top:10px;'><td><label class='txt-grey'>CC</label></td><td><select id='selEmailCc_" + noID + "' nodeId='" + noID + "' class='form-control selEmailCc'>");
                                                StrBuilder.Append("<option " + (emailCcRole.Equals("Caller") ? "selected='true'" : "") + ">Caller</option>");
                                                StrBuilder.Append("<option " + (emailCcRole.Equals("Agent") ? "selected='true'" : "") + ">Agent</option>");
                                                StrBuilder.Append("<option " + (emailCcRole.Equals("Supervisor") ? "selected='true'" : "") + ">Supervisor</option>");
                                                StrBuilder.Append("<option " + (emailCcRole.Equals("Manager") ? "selected='true'" : "") + ">Manager</option>");
                                                StrBuilder.Append("<option " + (emailCcRole.Equals("Other") ? "selected='true'" : "") + ">Other</option></select></td>");
                                                if (emailCcRole == "Other") {
                                                    StrBuilder.Append("<td><input type='text'class='form-control' placeholder='Enter email addresses seperated by a comma' id='txtEmailCcOther_" + noID + "' value='" + emailCc + "' /></td>");
                                                }
                                                else
                                                {
                                                    StrBuilder.Append("<td><input type='text'class='form-control' placeholder='Enter email addresses seperated by a comma' id='txtEmailCcOther_" + noID + "' style='display:none;' /></td>");
                                                }
                                                StrBuilder.Append("</tr></table>");
                                                StrBuilder.Append("<div class='form-group'><label class='txt-grey'>Choose email template</label>");
                                                StrBuilder.Append("<select id='selEmailTemplate_" + noID + "' nodeId='" + noID + "' class='form-control selEmailTemplate'><option>Choose template</option>");
                                                var selectedTemplateContent = "";
                                                for (int j = 0; j <= emailds.Tables[0].Rows.Count - 1; j++)
                                                {
                                                    if (emailds.Tables[0].Rows[j]["Id"].ToString() == templateId.ToString())
                                                    {
                                                        selectedTemplateContent = emailds.Tables[0].Rows[j]["TemplateContent"].ToString();
                                                        StrBuilder.Append("<option value='" + emailds.Tables[0].Rows[j]["Id"].ToString() + "' selected='true'>" + emailds.Tables[0].Rows[j]["TemplateName"].ToString()+ "</option>");
                                                    }
                                                    else
                                                    {
                                                        StrBuilder.Append("<option value='" + emailds.Tables[0].Rows[j]["Id"].ToString() + "'>" + emailds.Tables[0].Rows[j]["TemplateName"].ToString() + "</option>");
                                                    }
                                                }
                                                StrBuilder.Append("</select><textarea id='txtAreaEmailContent_" + noID + "' style='margin-top:10px;' class='form-control'>" + selectedTemplateContent + "</textarea></div><div class='errordiv text-center margin-top-10' nodeId='" + noID + "'></div></div>");
                                                StrBuilder.Append("<div class='modal-footer'><button type='button' class='btn green module-update' module='email'>Update</button><button type='button' data-dismiss='modal' class='btn module-cancel' module='email'>Cancel</button></div>"); 
                                            }
                                            else
                                            {
                                                StrBuilder.Append("<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button><h3>Email</h3></div>");
                                                StrBuilder.Append("<div class='modal-body'>No Email templates available</div>");
                                                resultObj = new JObject(new JProperty("Status", 2), new JProperty("Data", StrBuilder.ToString()));
                                                return resultObj;
                                            }
                                        }
                                        else
                                        {
                                            StrBuilder.Append("<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button><h3>Email</h3></div>");
                                            StrBuilder.Append("<div class='modal-body'>No Email templates available</div>");
                                            resultObj = new JObject(new JProperty("Status", 2), new JProperty("Data", StrBuilder.ToString()));
                                            return resultObj;
                                        }
                                    }
                                    else
                                    {
                                        StrBuilder.Append("<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button><h3>Email</h3></div>");
                                        StrBuilder.Append("<div class='modal-body'>No Email templates available</div>");
                                        resultObj = new JObject(new JProperty("Status", 2), new JProperty("Data", StrBuilder.ToString()));
                                        return resultObj;
                                    }
                            
                                } catch (Exception ex){
                                    Logger.Error(ex.ToString());
                                    resultObj = new JObject(new JProperty("Status", 0), new JProperty("ErrorReason", "Something Wrong With The Server"));
                                    return resultObj;
                                }
                                break;
                           case "sms":
                             DataSet smsds = new DataSet();
                                try
                                {
                                    smsds = GetEmailOrSmsTemplates(context, 2, 0);
                                    if (smsds != null)
                                    {
                                        if (smsds.Tables.Count > 1)
                                        {
                                            if (smsds.Tables[0].Rows.Count > 0)
                                            {
                                                StrBuilder.Clear();
                                                string smsTo = null, smsCc = null, smsToRole = null, smsCcRole = null;
                                                int templateId = 0;
                                                foreach (XmlNode node in x.ChildNodes)
                                                {
                                                    if (node.Name == "to")
                                                    {
                                                        smsToRole = node.Attributes["role"].Value;
                                                        smsTo = node.InnerText;
                                                    }
                                                    else if (node.Name == "cc")
                                                    {
                                                        smsCcRole = node.Attributes["role"].Value;
                                                        smsCc = node.InnerText;
                                                    }
                                                    else if (node.Name == "template")
                                                    {
                                                        templateId = Convert.ToInt32(node.InnerText);
                                                    }
                                                }

                                                StrBuilder.Clear();
                                                StrBuilder.Append("<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button> <h4 class='font-blue bold-6 mb-0'>Sms</h4></div>");
                                                StrBuilder.Append("<div class='modal-body'><table class='table no-border'>");
                                                StrBuilder.Append("<tr>");
                                                StrBuilder.Append("<td><label class='txt-grey'>To</label><select id='selSmsTo_" + noID + "' class='form-control selSmsTo' nodeId='" + noID + "'>");
                                                StrBuilder.Append("<option " + (smsToRole.Equals("Caller") ? "selected='true'" : "") + ">Caller</option>");
                                                StrBuilder.Append("<option " + (smsToRole.Equals("Agent") ? "selected='true'" : "") + ">Agent</option>");
                                                StrBuilder.Append("<option " + (smsToRole.Equals("Supervisor") ? "selected='true'" : "") + ">Supervisor</option>");
                                                StrBuilder.Append("<option " + (smsToRole.Equals("Manager") ? "selected='true'" : "") + ">Manager</option>");
                                                StrBuilder.Append("<option " + (smsToRole.Equals("Other") ? "selected='true'" : "") + ">Other</option></select></td>");
                                                if (smsToRole == "Other")
                                                {
                                                    StrBuilder.Append("<td><input type='text' class='form-control margin-top-25' placeholder='Enter mobile numbers seperated by a comma' value='" + smsTo + "' id='txtSmsToOther_" + noID + "' /></td>");
                                                }
                                                else
                                                {
                                                    StrBuilder.Append("<td><input type='text' class='form-control margin-top-25' placeholder='Enter mobile numbers seperated by a comma' id='txtSmsToOther_" + noID + "' style='display:none;' /></td>");
                                                }
                                                StrBuilder.Append("</tr>");
                                                StrBuilder.Append("<tr><td><label class='txt-grey'>And also send SMS to</label><select id='selSmsCc_" + noID + "' nodeId='" + noID + "' class='form-control selSmsCc'>");
                                                StrBuilder.Append("<option " + (smsCcRole.Equals("Caller") ? "selected='true'" : "") + ">Caller</option>");
                                                StrBuilder.Append("<option " + (smsCcRole.Equals("Agent") ? "selected='true'" : "") + ">Agent</option>");
                                                StrBuilder.Append("<option " + (smsCcRole.Equals("Supervisor") ? "selected='true'" : "") + ">Supervisor</option>");
                                                StrBuilder.Append("<option " + (smsCcRole.Equals("Manager") ? "selected='true'" : "") + ">Manager</option>");
                                                StrBuilder.Append("<option " + (smsCcRole.Equals("Other") ? "selected='true'" : "") + ">Other</option></select></td>");
                                                if (smsCcRole == "Other") {
                                                    StrBuilder.Append("<td><input type='text'class='form-control margin-top-25' placeholder='Enter mobile numbers seperated by a comma' id='txtSmsCcOther_" + noID + "' value='" + smsCc + "' /></td>");
                                                }
                                                else
                                                {
                                                    StrBuilder.Append("<td><input type='text'class='form-control margin-top-25' placeholder='Enter mobile numbers seperated by a comma' id='txtSmsCcOther_" + noID + "' style='display:none;' /></td>");
                                                }
                                                StrBuilder.Append("</tr></table>");
                                                StrBuilder.Append("<div class='form-group'><label class='txt-grey'>Choose sms template</label>");
                                                StrBuilder.Append("<select id='selSmsTemplate_" + noID + "' nodeId='" + noID + "' class='form-control selSmsTemplate'><option>Choose template</option>");
                                                var selectedTemplateContent = "";
                                                for (int j = 0; j <= smsds.Tables[0].Rows.Count - 1; j++)
                                                {
                                                    if (smsds.Tables[0].Rows[j]["Id"].ToString() == templateId.ToString())
                                                    {
                                                        selectedTemplateContent = smsds.Tables[0].Rows[j]["TemplateContent"].ToString();
                                                        StrBuilder.Append("<option value='" + smsds.Tables[0].Rows[j]["Id"].ToString() + "' selected='true'>" + smsds.Tables[0].Rows[j]["TemplateName"].ToString()+ "</option>");
                                                    }
                                                    else
                                                    {
                                                        StrBuilder.Append("<option value='" + smsds.Tables[0].Rows[j]["Id"].ToString() + "'>" + smsds.Tables[0].Rows[j]["TemplateName"].ToString() + "</option>");
                                                    }
                                                }
                                                StrBuilder.Append("</select><textarea id='txtAreaSmsContent_" + noID + "' style='margin-top:10px;' class='form-control'>" + selectedTemplateContent + "</textarea></div><div class='errordiv text-center margin-top-10' nodeId='" + noID + "'></div></div>");
                                                StrBuilder.Append("<div class='modal-footer'><button type='button' class='btn green module-update' module='sms'>Update</button><button type='button' data-dismiss='modal' class='btn module-cancel' module='sms'>Cancel</button></div>"); 
                                            }
                                            else
                                            {
                                                StrBuilder.Append("<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button><h3>Sms</h3></div>");
                                                StrBuilder.Append("<div class='modal-body'>No Sms templates available</div>");
                                                resultObj = new JObject(new JProperty("Status", 2), new JProperty("Data", StrBuilder.ToString()));
                                                return resultObj;
                                            }
                                        }
                                        else
                                        {
                                            StrBuilder.Append("<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button><h3>Sms</h3></div>");
                                            StrBuilder.Append("<div class='modal-body'>No Sms templates available</div>");
                                            resultObj = new JObject(new JProperty("Status", 2), new JProperty("Data", StrBuilder.ToString()));
                                            return resultObj;
                                        }
                                    }
                                    else
                                    {
                                        StrBuilder.Append("<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button><h3>Sms</h3></div>");
                                        StrBuilder.Append("<div class='modal-body'>No Sms templates available</div>");
                                        resultObj = new JObject(new JProperty("Status", 2), new JProperty("Data", StrBuilder.ToString()));
                                        return resultObj;
                                    }
                                   
                                } catch (Exception ex){
                                    Logger.Error(ex.ToString());
                                    resultObj = new JObject(new JProperty("Status", 0), new JProperty("ErrorReason", "Something Wrong With The Server"));
                                    return resultObj;
                                }
                           break;
                        }
                       
                        jObj = new JObject(new JProperty("Status", 1), new JProperty("Data", StrBuilder.ToString()));
                    }
                    else { jObj = resultObj; }
                }
                else { jObj = resultObj; }
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return jObj;
        }
        public JObject CreateStudio(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Studio studioObj = new BusinessRulesLayer.Studio();
                UDC.Studio studio = new UDC.Studio();
                studio.AccountId = accountId;
                //studio.CallerIdId = (context.Request["callerId"] != null && context.Request["callerId"] != "") ? Convert.ToInt32(context.Request["callerId"]) : 0;
                studio.AgentId = agentId;
                studio.DeletedNodeIds = context.Request["deleteNodes"];
                //studio.IsOutbound = (context.Request["isOutbound"] != null && context.Request["isOutbound"] != "") ? Convert.ToByte(context.Request["isOutbound"]) : Convert.ToByte(0);
                studio.IsActive = (context.Request["isActive"] != null && context.Request["isActive"] != "") ? Convert.ToByte(context.Request["isActive"]) : Convert.ToByte(0);
                studio.Id = (context.Request["studioId"] != null && context.Request["studioId"] != "") ? Convert.ToInt32(context.Request["studioId"]) : 0;
                studio.Name = context.Request["studioName"];
                studio.StudioXml = context.Request["studioXml"];
                studio.StudioData = context.Request["studioData"];
                resultObj = studioObj.CreateStudio(MyConfig.MyConnectionString, studio);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public JObject ConvertTextToSpeech(HttpContext context)
        {
            JObject resultObj = new JObject();
            try {
                Press3.BusinessRulesLayer.Studio studioObj = new BusinessRulesLayer.Studio();
                resultObj = studioObj.ConvertTextToSpeech(MyConfig.MyConnectionString, MyConfig.IvrStudioShowClipUploadPath, accountId, context.Request["language"], context.Request["message"]);
            }
            catch (Exception ex){
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public JObject GenerateStudioPopups(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                string nodeOption = null;
                string nodeId = null;
                nodeOption = context.Request["nodeOption"];
                nodeId = context.Request["nodeId"];
                StringBuilder StrBuilder = new StringBuilder();
                string Tts_Drop = "<select id='ttschars_" + nodeId + "' ></select>";

                switch (nodeOption)
                {
                    case "Dial Extension":
                        StrBuilder.Clear();
                        StrBuilder.Append("<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button><h4 class='bold-6 font-blue'>Dial extension</h4></div>");
                        StrBuilder.Append("<div class='modal-body'><div class='module-error'></div>");
                        StrBuilder.Append("<h5 class='txt-grey bold-6 f_15'>Greeting Message</h5>");
                        StrBuilder.Append("<div class='greeting module-left'>");
                        StrBuilder.Append("<label class='margin-right-20' ><input type='radio' checked=true class='greeting_rd' name='greeting_play_option_" + nodeId + "' nodeid=" + nodeId + " parent='greeting' value='file'/> Upload clip</label>");
                        StrBuilder.Append("<label><input type='radio' class='greeting_rd' name='greeting_play_option_" + nodeId + "' nodeid=" + nodeId + " parent='greeting' value='text'/> Text message </label>");
                        StrBuilder.Append("<div class='clear'></div>");
                        StrBuilder.Append("<div ID='fileupload_div_GttMsg'>");
                        StrBuilder.Append("<div class='uploadfile' nodeid='" + nodeId + "'>");
                        StrBuilder.Append("<div class='audio_player' nodeid='" + nodeId + "' style='display:none;'>");
                        StrBuilder.Append("<div class='player'></div><a href='#' class='uploadnew' style='float:none;'>Upload new</a></div>");
                        StrBuilder.Append("<input type=hidden name='file_element' value='greeting_play_option'/><input class='flUpload_GttMsg' nodeid='" + nodeId + "' type='file' name='files[]' multiple=''></div></div>");
                        StrBuilder.Append("<div class='textmessage' style='display:none;'>");
                        StrBuilder.Append("<div id='greet_msg'><select class='ddl_lang form-control input-inline margin-right-5' parent1='greet_conv' nodeid='" + nodeId + "'><option lid='1' sid='1' value='1'>English</option> </select><textarea id='txt_msg' class='form-control input-inline'></textarea></div>");
                        StrBuilder.Append("<div class='greet_conv' style='display:none'><input type='button' class='btn blue btn_convert' name='greet_msg' value='convert' /></div>");
                        StrBuilder.Append("</div><div class='clear'></div></div>");
                        StrBuilder.Append("<div class='margin-top-15'><label class='margin-right-10'>Extension input followed by :</label><label><select class='ExtTerminationKey' nodeid='"+ nodeId +"'><option value='1'>*</option><option value='2'>#</option></select></label></div>");
                        StrBuilder.Append("<h5 class='txt-grey bold-6 f_15'>Invalid Extension</h5>");
                        StrBuilder.Append("<div class='InvalidExt module-left'>");
                        StrBuilder.Append("<label class='margin-right-20' ><input type='radio' checked=true class='InvalidExt_rd' name='InvalidExt_play_option_" + nodeId + "' nodeid=" + nodeId + " parent='InvalidExt' value='file'/> Upload clip</label>");
                        StrBuilder.Append("<label><input type='radio' class='InvalidExt_rd' name='InvalidExt_play_option_" + nodeId + "' nodeid=" + nodeId + " parent='InvalidExt' value='text'/> Text message </label>");
                        StrBuilder.Append("<div class='clear'></div>");
                        StrBuilder.Append("<div ID='fileupload_div_InvalidExt'>");
                        StrBuilder.Append("<div class='uploadfile' nodeid='" + nodeId + "'><div class='audio_player' nodeid='" + nodeId + "' style='display:none;'> <div class='player'></div>");
                        StrBuilder.Append("<a href='#' class='uploadnew' style='float:none;'>Upload new</a></div>");
                        StrBuilder.Append("<input type=hidden name='file_element' value='InvalidExt_play_option'/><input class='flUpload_InvalidExt' nodeid='" + nodeId + "' type='file' name='files[]' multiple=''></div></div>");
                        StrBuilder.Append("<div class='textmessage' style='display:none;'><div id='InvalidExt_msg'><select class='ddl_lang form-control input-inline margin-right-5' parent1='InvalidExt_conv' nodeid='" + nodeId + "'><option lid='1' sid='1' value='1'>English</option> </select><textarea id='txt_msg' class='form-control input-inline'></textarea></div>");
                        StrBuilder.Append("<div class='InvalidExt_conv' style='display:none'><input type='button' class='btn blue btn_convert' name='InvalidExt_msg' value='convert' /></div>");
                        StrBuilder.Append("</div><div class='clear'></div></div>");
                        StrBuilder.Append("<div class='margin-top-15'><label class='margin-right-10'>Goto :</label><label class='steps-options invalid-key'></label></div>");
                        //StrBuilder.Append("<h5 class='txt-grey bold-6 f_15'>No Answer </h5><div class='NoAns module-left'>");
                        //StrBuilder.Append("<label class='margin-right-20' ><input type='radio' checked=true class='NoAns_rd' name='NoAns_play_option_" + nodeId + "' nodeid=" + nodeId + " parent='NoAns' value='file'/> Upload clip</label>");
                        //StrBuilder.Append("<label><input type='radio' class='NoAns_rd' name='NoAns_play_option_" + nodeId + "' nodeid=" + nodeId + " parent='NoAns' value='text'/> Text message </label>");
                        //StrBuilder.Append("<div class='clear'></div>");
                        //StrBuilder.Append("<div ID='fileupload_div_NoAns'><div class='uploadfile' nodeid='" + nodeId + "'><div class='audio_player' nodeid='" + nodeId + "' style='display:none;'> <div class='player'></div> <a href='#' class='uploadnew' style='float:none;'>Upload new</a></div>");
                        //StrBuilder.Append("<input type=hidden name='file_element' value='NoAns_play_option'/><input class='flUpload_NoAns' nodeid='" + nodeId + "' type='file' name='files[]' multiple=''></div></div>");
                        //StrBuilder.Append("<div class='textmessage' style='display:none;'><div id='NoAns_msg'><select class='ddl_lang form-control input-inline margin-right-5' parent1='NoAns_conv' nodeid='" + nodeId + "'><option lid='1' sid='1' value='1'>English</option> </select><textarea id='txt_msg' class='form-control input-inline'></textarea></div><div class='NoAns_conv' style='display:none'><input type='button' class='btn blue btn_convert' name='NoAns_msg' value='convert' /></div></div>");
                        //StrBuilder.Append("</div><div class='clear'></div></div>");
                        StrBuilder.Append("<div class='errordiv text-center margin-top-10' nodeId='" + nodeId + "'></div></div><div class='dial_ext_nodes' nodeId='" + nodeId + "'></div><div class='modal-footer'><button type='button' class='btn green module-save' module='dial extension'>Save</button> <button type='button' data-dismiss='modal' class='btn module-cancel' module='dial extension'>Cancel</button></div></div>");
                        break;
                    case "Play message":
                        StrBuilder.Clear();
                        StrBuilder.Append("<div class='modal-header'> <button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button> <h4 class='bold-6 font-blue'>Play Message</h4></div><div class='modal-body'><ul class='module-list' style='padding:0px;'><li><input type='radio' checked=true name='play_option_" + nodeId + "' value='file'/> <label class='txt-grey'>Upload clip</label><div ID='fileupload_div'><div class='uploadfile' path='' nodeid='" + nodeId + "'><div class='audio_player' nodeid='" + nodeId + "' style='display:none; float:none;'><div class='player'></div><a href='#' class='uploadnew' style='display:none;float:none;'>Upload new</a></div>");
                        StrBuilder.Append("<input class='flUpload_11' nodeid='" + nodeId + "' type='file' name='files[]' multiple><input type=hidden name='file_element' value='greeting_play_option'/></div><div ID='fileupload_div'></li><li><input type='radio' id='text_radio' name='play_option_" + nodeId + "' value='text'/> <label class='txt-grey'>Text message</label><div class='textmessage' style='margin-top:10px;'><div id='play_msg'><select class='ddl_lang form-control input-inline margin-bottom-10' parent1='play_conv' nodeid='" + nodeId + "' style='display:none'><option lid='1' sid='1' value='1'>English</option> </select><textarea id='txt_msg' class='form-control'></textarea></li></ul><div class='errordiv text-center margin-top-10' nodeId='" + nodeId + "'></div></div><div class='modal-footer'><button type='button' class='btn green module-save' module='play message'>Save</button> <button type='button' data-dismiss='modal' class='btn module-cancel' module='play message'>Cancel</button></div>");
                        break;
                    case "Hang Up":
                        StrBuilder.Clear();
                        StrBuilder.Append("<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button></div>");
                        StrBuilder.Append("<div class='modal-body'> Hang up the call </div>");
                        StrBuilder.Append("<div class='modal-footer'>  <button type='button'  class='btn green module-save' module='hang up'>Save</button>  <button type='button' data-dismiss='modal' class='btn module-cancel' module='hang up'>Cancel</button></div>");
                        break;
                    case "goto":
                        StrBuilder.Clear();
                        StrBuilder.Append("<div><div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button><h4 class='bold-6 font-blue'>Goto Your required step</h4></div><div class='modal-body'><div class='field'><label style='width:50px;float:left;margin-left:50px;'>Go to : </label>");
                        StrBuilder.Append("<div class='goto_step' style='float:left;margin-left:20px;'><div class='steps-options'></div></div></div><div class='clear'></div></div><div class='modal-footer'>  <button type='button'  class='btn green module-save' module='goto'>Save</button>  <button type='button' data-dismiss='modal' class='btn module-cancel' module='goto'>Cancel</button></div></div>");
                        break;
                    case "Menu":
                        StrBuilder.Clear();
                        StrBuilder.Append("<div><div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button><h4 class='bold-6 font-blue'>Play the following menu option</h4></div><div class='modal-body'><h5 class='txt-grey bold-6 f_15'>Greeting Message</h5><div class='greeting module-left'>");
                        StrBuilder.Append("<input type=hidden name='callback' value= '' /><label class='margin-right-20' ><input type='radio' checked=true class='greeting_rd' name='greeting_play_option_" + nodeId + "' nodeid=" + nodeId + " parent='greeting' value='file'/> Upload clip</label><label><input type='radio' class='greeting_rd' name='greeting_play_option_" + nodeId + "' nodeid=" + nodeId + " parent='greeting' value='text'/> Text message </label>");
                        StrBuilder.Append("<div class='clear'></div><div ID='fileupload_div_GttMsg'><div class='uploadfile' nodeid='" + nodeId + "'><div class='audio_player' nodeid='" + nodeId + "' style='display:none;'><div class='player'></div><a href='#' class='uploadnew' style='float:none;'>Upload new</a></div><input type=hidden name='file_element' value='greeting_play_option'/><input class='flUpload_GttMsg' nodeid='" + nodeId + "' type='file' name='files[]' multiple=''></div></div>");

                        StrBuilder.Append("<div class='textmessage' style='display:none;'><div id='greet_msg'><select class='ddl_lang form-control input-inline margin-right-5' parent1='greet_conv' nodeid='" + nodeId + "'><option lid='1' sid='1' value='1'>English</option> </select><textarea id='txt_msg' class='form-control input-inline'></textarea></div><div class='greet_conv' style='display:none'><input type='button' class='btn blue btn_convert' name='greet_msg' value='convert' /></div></div><div class='clear'></div><div id='div_vclips'></div><h5 class='txt-lite-grey bold-6 margin-top-15'>key options</h5><div class='module-left'><div class='menu-option-head'><div class='opt'>Key</div><div class='opt_val'>Key Value </div><button type='button' class='btn btn-default btn-sm addmore font-green'><i class='icon-plus font-green'></i> Add New</button></div><div class='clear'></div>");
                        StrBuilder.Append("<div class='menu-option'><input type='text' class='opt form-control' /><input type='text' class='opt_val form-control'/></div><div class='clear'></div><div class='menu-option'><input type='text' class='opt form-control'/><input type='text' class='opt_val form-control'/></div><div class='clear'></div></div><div class='clear'></div></div><div class='question'><h5 class='txt-grey bold-6 f_15'>Invalid key </h5></div><div class='invalid-key module-left'><p>Play 'invalid key' message </p>");
                        StrBuilder.Append("<label class='margin-right-20'><input type='radio' checked=true class='invalid_rd' name='invalid_play_option_" + nodeId + "' nodeid=" + nodeId + " parent='invalid-key' value='file'/> Upload clip</label><label><input type='radio' class='invalid_rd' name='invalid_play_option_" + nodeId + "' nodeid=" + nodeId + " parent='invalid-key' value='text'/> Text message</label><div class='clear'></div><div class='textmessage' style='display:none;'><div id='invalid_msg'><select class='ddl_lang1 form-control input-inline margin-right-5' parent1='invalid_conv' nodeid='" + nodeId + "'><option lid='1' sid='1' value='1'>English</option></select><textarea id='txt_msg1' class='form-control input-inline'>You have pressed invalid key. Please listen to the menu carefully.</textarea></div><div class='invalid_conv' style='display:none'><input type='button' class='btn blue btn_convert' name='invalid_msg' value='convert' /></div><div id='div_vclips1'></div></div>");
                        StrBuilder.Append("<div class='clear'></div><div ID='fileupload_div_InvalidKey'><div class='uploadfile' nodeid='" + nodeId + "'><div class='audio_player' nodeid='" + nodeId + "' style='display:none;'><div class='player'></div><a href='#' class='uploadnew' style='display:none; float:none;'>Upload new</a></div><input class='flUpload_InvalidKey' nodeid='" + nodeId + "' type='file' name='files[]' multiple></div>");
                        StrBuilder.Append("<div class='margin-top-15'><label class='margin-right-10'>Goto :</label><label class='steps-options invalid-key'></label></div></div><div class='clear'></div><div class='errordiv text-center margin-top-10 f_13 margin-bottom-15' nodeId='" + nodeId + "'></div></div><div class='modal-footer'><button type='button'  class='btn green module-save' module='menu'>Save</button><button type='button' data-dismiss='modal' class='btn module-cancel' module='menu'>Cancel</button></div></div>");

                        break;
                    case "Ring user(s)":
                         DataSet ds = new DataSet();
                         try
                         {
                             ds = GetSkillGroupsDs(context);
                             if (ds != null)
                             {
                                 if (ds.Tables.Count > 1)
                                 {
                                     if (ds.Tables[0].Rows.Count > 0)
                                     {

                                         StrBuilder.Clear();
                                         StrBuilder.Append("<div class='ring'><div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button><h4 class='bold-6 font-blue'>Ring - Skill Groups</h4></div><div class='modal-body'><div style='margin-bottom:5px;' class='div_select_agent'><div class='margin-bottom-5 txt-grey'>Select Skillgroup(s):</div>");
                                         StrBuilder.Append("<select class='skillGroupclass form-control' id='selSkillGroup_" + nodeId + "' nodeid='" + nodeId + "'>");

                                         for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                                         {
                                             StrBuilder.Append("<option value='" + ds.Tables[0].Rows[i]["Id"].ToString() + "'>" + ds.Tables[0].Rows[i]["Name"].ToString() + "</li>");
                                         }

                                         StrBuilder.Append("</select>");
                                         StrBuilder.Append("<div class='div_ringstragery' style='margin-top:20px;margin-bottom:20px;'><div class='margin-bottom-5 txt-grey'>Ringgroup Strategy:</div>");
                                         StrBuilder.Append("<select class='ringstrategy form-control' id='selRing_" + nodeId + "' nodeid='" + nodeId + "'>");
                                         StrBuilder.Append("<option value='linear' name='Calls will be distributed in order, starting at the beginning each time.'>Linear Call Distribution</option>");
                                         // StrBuilder.Append("<option value='simultaneous' name='Calls will be presented to all available extensions simultaneously.'>Simultaneous Call Distribution</option>");
                                         StrBuilder.Append("<option value='circular' name='Calls will be distributed evenly i.e. The first call goes to line 1. The second call goes to line 2, even if line 1 is free. if line 2 is busy, the call will be routed to 3 before it is rounded to 1.'>Circular Call Distribution</option>");
                                         StrBuilder.Append("<option value='uniform' name='Calls will be distributed uniformly, starting with the agent who has handled the fewest calls.'>Uniform Call Distribution</option>");
                                         StrBuilder.Append("</select></div>");
                                         StrBuilder.Append("<div id='selRingText_" + nodeId + "' style='border:1px solid #ccc;padding:5px;'>Calls will be distributed in order, starting at the beginning each time.</div><div class='clear'></div>");
                                         StrBuilder.Append("<label style='margin-top:10px;' class='txt-grey'>Wait Clip:</label> <div id='fileupload_div'><div class='uploadfile' path='' nodeid='" + nodeId + "'><div class='audio_player' nodeid='" + nodeId + "' style='display:none;'><div class='player'></div><a href='#' class='uploadnew' style='display:none; float:none;'>Upload new</a></div>");
                                         StrBuilder.Append("<input class='flUpload_11' nodeid='" + nodeId + "' type='file' name='files[]' multiple><input type=hidden name='file_element' value='greeting_play_option'/><div class='errordiv text-center margin-top-10' nodeId='" + nodeId + "'></div></div>");
                                         StrBuilder.Append("<div class='modal-footer' style='margin-top:20px;'> <button type='button'  class='btn green module-save' module='ring user(s)'>Save</button><button type='button' data-dismiss='modal' class='btn module-cancel' module='ring user(s)'>Cancel</button></div></div>");
                                     }
                                     else
                                     {
                                         StrBuilder.Append("<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button><h3>Ring - Skill Groups</h3></div>");
                                         StrBuilder.Append("<div class='modal-body'>No Skillgroups available</div>");
                                         resultObj = new JObject(new JProperty("Status", 2), new JProperty("Data", StrBuilder.ToString()));
                                         return resultObj;
                                     }
                                 }
                                 else
                                 {
                                     StrBuilder.Append("<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button><h3>Ring - Skill Groups</h3></div>");
                                     StrBuilder.Append("<div class='modal-body'>No Skillgroups available</div>");
                                     resultObj = new JObject(new JProperty("Status", 2), new JProperty("Data", StrBuilder.ToString()));
                                     return resultObj;
                                 }
                             }
                             else
                             {
                                 StrBuilder.Append("<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button><h3>Ring - Skill Groups</h3></div>");
                                 StrBuilder.Append("<div class='modal-body'>No Skillgroups available</div>");
                                 resultObj = new JObject(new JProperty("Status", 2), new JProperty("Data", StrBuilder.ToString()));
                                 return resultObj;
                             }
                         }
                         catch (Exception ex)
                         {
                             Logger.Error(ex.ToString());
                             resultObj = new JObject(new JProperty("Status", 0), new JProperty("ErrorReason", "Something Wrong With The Server"));
                             return resultObj;
                         }
                        break;
                    case "Time of the day":
                         DataSet timeslotds = new DataSet();
                        try
                        {
                            timeslotds = GetTimeSlots(context);
                            if (timeslotds != null)
                            {
                                if (timeslotds.Tables.Count > 0)
                                {
                                    if (timeslotds.Tables[0].TableName == "OutputParameters")
                                    {
                                        StrBuilder.Append("<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button><h3>Route Calls according to the time of the day</h3></div>");
                                        StrBuilder.Append("<div class='modal-body'>No Time of the days available</div>");
                                        resultObj = new JObject(new JProperty("Status", 2), new JProperty("Data", StrBuilder.ToString()));
                                        return resultObj;
                                    }
                                    else
                                    {
                                        if (timeslotds.Tables[0].Rows.Count > 0)
                                        {
                                            StrBuilder.Clear();
                                            StrBuilder.Append("<div class='modal-header'>");
                                            StrBuilder.Append("<button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button>");
                                            StrBuilder.Append("<h4 class='modal-title bold font-blue-soft'>Route Calls according to the time of the day</h4>");
                                            StrBuilder.Append("</div>");
                                            StrBuilder.Append("<div class='modal-body f_13 ringUserDet' id='ringUserDet_" + nodeId + "'>");
                                            StrBuilder.Append("<div class='form-group TimeSlotCounts' id='TimeSlotCount_" + nodeId + "' ><label class='label-head blocked'>Select Time Frame 1</label>");
                                            StrBuilder.Append("<select class='form-control input-inline selTimeSlots' timeSlotNo='1' id='selTimeSlot_" + nodeId + "_1' nodeId='" + nodeId + "'>");
                                            StrBuilder.Append("<option value='0'>Select Timeslot</option>");

                                            for (int k = 0; k < timeslotds.Tables[0].Rows.Count; k++)
                                            {
                                                StrBuilder.Append("<option value='" + timeslotds.Tables[0].Rows[k]["Id"].ToString() + "'>" + timeslotds.Tables[0].Rows[k]["Name"].ToString().ToString() + "</option>");
                                            }

                                            StrBuilder.Append("</select>");
                                            StrBuilder.Append("<a class='margin-left-5 viewTimeSlots'style='display:none;' id='viewTimeSlot_" + nodeId + "_1' timeSlotNo='1' nodeId='" + nodeId + "'>View</a>");
                                            StrBuilder.Append("</div>");
                                            StrBuilder.Append("<div class='form-group text-center'>");
                                            StrBuilder.Append("<a class='font-green addTimeSlots' nodeId='" + nodeId + "' id='addTimeSlot_" + nodeId + "' ><i class='fa fa-plus margin-right-5'></i> Add New Time Frame</a></div>");
                                            StrBuilder.Append("<div class='well well-sm well-grey brd pad-15' id='viewTiming_" + nodeId + "' style='display:none;'>");
                                            StrBuilder.Append("<label><span class='label-head margin-right-10' id='slotName_" + nodeId + "'></label>");
                                            StrBuilder.Append("<hr style='border-color:#a5c4d0;' />");
                                            StrBuilder.Append("<div class='table-responsive'><table class='table no-border'>");
                                            StrBuilder.Append("<thead><tr><th class='bold-6'>Day</th><th class='bold-6'>Time</th></tr></thead>");
                                            StrBuilder.Append("<tbody id='showTimings_" + nodeId + "'></tbody></table></div></div></div>");
                                            StrBuilder.Append("<div class='modal-footer'><div class='errordiv left' nodeId='" + nodeId + "'></div> ");
                                            StrBuilder.Append("<button type='button' class='btn green module-save' module='time of the day' >Save</button>");
                                            StrBuilder.Append("<button type='button' data-dismiss='modal' class='btn module-cancel' module='time of the day' >Cancel</button>");
                                            StrBuilder.Append("</div>");
                                        }
                                        else
                                        {
                                            StrBuilder.Append("<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button><h3>Route Calls according to the time of the day</h3></div>");
                                            StrBuilder.Append("<div class='modal-body'>No Time of the days available</div>");
                                            resultObj = new JObject(new JProperty("Status", 2), new JProperty("Data", StrBuilder.ToString()));
                                            return resultObj;
                                        }
                                    }
                                }
                                else
                                {
                                    StrBuilder.Append("<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button><h3>Route Calls according to the time of the day</h3></div>");
                                    StrBuilder.Append("<div class='modal-body'>No Time of the days available</div>");
                                    resultObj = new JObject(new JProperty("Status", 2), new JProperty("Data", StrBuilder.ToString()));
                                    return resultObj;
                                }
                            }
                            else
                            {
                                StrBuilder.Append("<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button><h3>Route Calls according to the time of the day</h3></div>");
                                StrBuilder.Append("<div class='modal-body'>No Time of the days available</div>");
                                resultObj = new JObject(new JProperty("Status", 2), new JProperty("Data", StrBuilder.ToString()));
                                return resultObj;
                            }
                        }
                        catch (Exception ex)
                        {
                            Logger.Error(ex.ToString());
                            resultObj = new JObject(new JProperty("Status", 0), new JProperty("ErrorReason", "Something Wrong With The Server"));
                            return resultObj;
                        }
                        break;
                    case "Voice mail":
                        DataSet emailTmpds = new DataSet();
                        try
                        {
                            emailTmpds = GetEmailOrSmsTemplates(context, 1, 0);
                        }
                        catch (Exception ex)
                        {
                            Logger.Error(ex.ToString());
                            resultObj = new JObject(new JProperty("Status", 0), new JProperty("ErrorReason", "Something Wrong With The Server"));
                            return resultObj;
                        }
                        DataSet smsTmpds = new DataSet();
                        try
                        {
                            smsTmpds = GetEmailOrSmsTemplates(context, 2, 0);
                        }
                        catch (Exception ex)
                        {
                            Logger.Error(ex.ToString());
                            resultObj = new JObject(new JProperty("Status", 0), new JProperty("ErrorReason", "Something Wrong With The Server"));
                            return resultObj;
                        }
                            StrBuilder.Clear();
                            StrBuilder.Append("<div><div class='modal-header'> <button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button> <h4 class='bold-6 font-blue'>Send the call to voice mail of user ..</h4></div><div class='modal-body'><div class='module-error'></div><div class='clear'></div><ul class='module-list' style='padding:0px;'><li><h5 class='f_15 txt-grey bold-6'>Greeting message</h5></li><li class='greeting'><label class='margin-right-20' ><input type='radio' name='greeting_play_option_" + nodeId + "' class='greeting_rd' nodeid='" + nodeId + "' parent='greeting' value='file'/> Upload clip</label><label><input type='radio' checked=true name='greeting_play_option_" + nodeId + "' class='greeting_rd' nodeid='" + nodeId + "' parent='greeting' value='text'/> Text message </label><div class='clear'></div><div ID='fileupload_div_GttMsg'><div class='uploadfile' nodeid='" + nodeId + "' style='display:none;'><div class='audio_player' nodeid='" + nodeId + "' style='display:none;'><div class='player'></div><a href='#' class='uploadnew' style='float:none;'>Upload new</a></div><input type=hidden name='file_element' value='greeting_play_option'/><input class='flUpload_GttMsg' nodeid='" + nodeId + "' type='file' name='files[]' multiple=''></div><div class='textmessage' ><textarea class='form-control'>You have reached voice mail. Please leave your message after the beep.</textarea> </div></li><li><hr><h5 class='txt-grey f_15 bold-6'>Thanks Message</h5></li><li class='thanks'> <label class='margin-right-20' ><input type='radio' name='thanks_play_option_" + nodeId + "' class='thanks_rd' nodeid='" + nodeId + "' parent='thanks' value='file'/> Upload clip</label> <label><input type='radio' checked=true name='thanks_play_option_" + nodeId + "' class='thanks_rd' nodeid='" + nodeId + "' parent='thanks' value='text'/> Text message</label> <div class='clear'></div><div id='fileupload_div_thnksMsg'><div class='uploadfile' nodeid='" + nodeId + "' style='display:none;'><div class='audio_player' nodeid='" + nodeId + "' style='display:none;'><div class='player'></div><a href='#' class='uploadnew' style='float:none;'>Upload new</a></div> <input type=hidden name='file_element' value='thanks_play_option'/><input class='flUpload_thksMsg' nodeid='" + nodeId + "' type='file' name='files[]' multiple=''></div></div><div class='textmessage' > <textarea class='form-control'>Thank you for recording your voice.</textarea> </div></li>");
                            StrBuilder.Append("<li><hr><label class='margin-right-15'>Play beep sound before recording ");
                            StrBuilder.Append("<label class='margin-right-10'><input name='RecordBeep' nodeId='" + nodeId + "' chkId='Yes' checked='checked' type='radio'> Yes</label>");
                            StrBuilder.Append("<label class='margin-right-10'><input name='RecordBeep' nodeId='" + nodeId + "' chkId='No' type='radio'> No</label>");
                            StrBuilder.Append("</li>");
                            StrBuilder.Append("<li><label class='margin-right-15'>Finish recording on press key </label> <input class='FinishOnKey form-control input-inline' nodeId='" + nodeId + "' id='FinishOnKeyVal_" + nodeId + "' maxlength='1' type='text'></li>");
                            StrBuilder.Append("<li><label class='margin-right-15'>Max recording time limit </label> <input class='RecordClipTime form-control input-inline' nodeId='" + nodeId + "' id='RecordClipTime_" + nodeId + "' maxlength='2' type='text'> sec</li>");
                            StrBuilder.Append("<li><hr><h5 class='txt-grey bold-6 f_15'>Notifications </h5></li>");
                            StrBuilder.Append("<li><h5 class='bold-6'>Send To: </h5></li>");
                            StrBuilder.Append("<li><label class='margin-left-15'><input type=checkbox class='sendNotificationsTo' nodeId='" + nodeId + "' chkName='Agent'/> Agent</label></li>");
                            StrBuilder.Append("<li><label class='margin-left-15'><input type=checkbox class='sendNotificationsTo' nodeId='" + nodeId + "' chkName='Supervisor'/> Supervisor</label></li>");
                            StrBuilder.Append("<li><label class='margin-left-15'><input type=checkbox class='sendNotificationsTo' nodeId='" + nodeId + "' chkName='Manager'/> Manager</label></li>");
                            StrBuilder.Append("<li><h5 class='bold-6'>Type of notifications: </h5></li>");
                            StrBuilder.Append("<li><label class='margin-left-15'><input type=checkbox class='sms-chk' nodeId='" + nodeId + "' /> SMS </label></li>");
                            StrBuilder.Append("<li class='voiceSmsTemplate' id='smsTemplate_" + nodeId + "' nodeId='" + nodeId + "' style='display:none; padding-left:15px;'>Choose template <select class='form-control' nodeId='" + nodeId + "' id='chkSms_" + nodeId + "'>");
                            if (smsTmpds.Tables.Count > 1)
                            {
                                if (smsTmpds.Tables[0].Rows.Count > 0)
                                {
                                    StrBuilder.Append("<option value='0'>Select Template</option>");
                                    for (int j = 0; j < smsTmpds.Tables[0].Rows.Count; j++)
                                    {
                                        StrBuilder.Append("<option value=" + smsTmpds.Tables[0].Rows[j]["Id"] + ">" + smsTmpds.Tables[0].Rows[j]["TemplateName"] + "</option>");
                                    }
                                }
                                else
                                {
                                    StrBuilder.Append("<option value='0'>No Templates</option>");
                                }
                            }
                            else
                            {
                                StrBuilder.Append("<option value='0'>No Templates</option>");
                            }
                            
                            StrBuilder.Append("</select></li>");
                            StrBuilder.Append("<li><label class='margin-left-15'><input type=checkbox class='email-chk' nodeId='" + nodeId + "' /> Email with voice mail recording </label></li>");
                            StrBuilder.Append("<li class='voiceEmailTemplate' id='emailTemplate_" + nodeId + "' nodeId='" + nodeId + "' style='display:none;padding-left:15px;'>Choose template <select class='form-control' nodeId='" + nodeId + "' id='chkEmail_" + nodeId + "'>");
                            if (emailTmpds.Tables.Count > 1)
                            {
                                if (emailTmpds.Tables[0].Rows.Count > 0)
                                {
                                    StrBuilder.Append("<option value='0'>Select Template</option>");
                                    for (int j = 0; j < emailTmpds.Tables[0].Rows.Count; j++)
                                    {
                                        StrBuilder.Append("<option value=" + emailTmpds.Tables[0].Rows[j]["Id"] + ">" + emailTmpds.Tables[0].Rows[j]["TemplateName"] + "</option>");
                                    }
                                }
                                else
                                {
                                    StrBuilder.Append("<option value='0'>No Templates</option>");
                                }
                            }
                            else
                            {
                                StrBuilder.Append("<option value='0'>No Templates</option>");
                            }
                            StrBuilder.Append("</select></li>");
                            StrBuilder.Append("</ul><div class='errordiv text-center margin-top-10' nodeId='" + nodeId + "'></div></div>");
                            StrBuilder.Append("<div class='modal-footer'> <button type='button' class='btn green module-save' module='voice mail'>Save</button> <button type='button' data-dismiss='modal' class='btn module-cancel' module='voice mail'>Cancel</button></div></div>");
                        break;
                    case "Email":
                        DataSet emailds = new DataSet();
                        try
                        {
                            emailds = GetEmailOrSmsTemplates(context, 1, 0);
                            if (emailds != null)
                            {
                                if (emailds.Tables.Count > 1)
                                {
                                    if (emailds.Tables[0].Rows.Count > 0)
                                    {
                                        StrBuilder.Clear();
                                        StrBuilder.Append("<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button><h4 class='font-blue bold-6 mb-0'>Email</h4></div>");
                                        StrBuilder.Append("<div class='modal-body'>");
                                        StrBuilder.Append("<table class='table no-border'><tr><td class='col-sm-1'><label class='txt-grey'>To</label></td>");
                                        StrBuilder.Append("<td><select id='selEmailTo_" + nodeId + "' class='form-control selEmailTo' nodeId='" + nodeId + "'><option>Caller</option><option>Agent</option><option>Supervisor</option><option>Manager</option><option>Other</option></select></td>");
                                        StrBuilder.Append("<td><input type='text' class='form-control' placeholder='Enter email addresses seperated by a comma' id='txtEmailToOther_" + nodeId + "' style='display:none;'/></td></tr>");
                                        StrBuilder.Append("<tr style='margin-top:10px;'><td><label class='txt-grey'>CC</label></td>");
                                        StrBuilder.Append("<td><select id='selEmailCc_" + nodeId + "' class='form-control selEmailCc' nodeId='" + nodeId + "'><option>Caller</option><option>Agent</option><option>Supervisor</option><option>Manager</option><option>Other</option></select></td>");
                                        StrBuilder.Append("<td><input type='text'class='form-control' placeholder='Enter email addresses seperated by a comma' id='txtEmailCcOther_" + nodeId + "' style='display:none;' /></td></tr></table>");
                                        StrBuilder.Append("<div class='form-group'><label class='txt-grey'>Choose email template</label><select id='selEmailTemplate_" + nodeId + "' nodeId='" + nodeId + "' class='form-control selEmailTemplate'>");
                                        StrBuilder.Append("<option value=''>Choose template</option>");
                                        for (int i = 0; i <= emailds.Tables[0].Rows.Count - 1; i++)
                                        {
                                            StrBuilder.Append("<option value='" + emailds.Tables[0].Rows[i]["Id"].ToString() + "'>" + emailds.Tables[0].Rows[i]["TemplateName"].ToString().ToString() + "</option>");
                                        }
                                        StrBuilder.Append("</select><textarea id='txtAreaEmailContent_" + nodeId + "' style='margin-top:10px;display:none;' class='form-control'></textarea></div><div class='errordiv text-center margin-top-10' nodeId='" + nodeId + "'></div></div>");
                                        StrBuilder.Append("<div class='modal-footer'><button type='button' class='btn green module-save' module='email'>Save</button><button type='button' data-dismiss='modal' class='btn module-cancel' module='email'>Cancel</button></div>"); 
                                    }
                                    else
                                    {
                                        StrBuilder.Append("<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button><h3>Email</h3></div>");
                                        StrBuilder.Append("<div class='modal-body'>No Email templates available</div>");
                                        resultObj = new JObject(new JProperty("Status", 2), new JProperty("Data", StrBuilder.ToString()));
                                        return resultObj;
                                    }
                                }
                                else
                                {
                                    StrBuilder.Append("<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button><h3>Email</h3></div>");
                                    StrBuilder.Append("<div class='modal-body'>No Email templates available</div>");
                                    resultObj = new JObject(new JProperty("Status", 2), new JProperty("Data", StrBuilder.ToString()));
                                    return resultObj;
                                }
                            }
                            else
                            {
                                StrBuilder.Append("<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button><h3>Email</h3></div>");
                                StrBuilder.Append("<div class='modal-body'>No Email templates available</div>");
                                resultObj = new JObject(new JProperty("Status", 2), new JProperty("Data", StrBuilder.ToString()));
                                return resultObj;
                            }
                            
                        } catch (Exception ex){
                            Logger.Error(ex.ToString());
                            resultObj = new JObject(new JProperty("Status", 0), new JProperty("ErrorReason", "Something Wrong With The Server"));
                            return resultObj;
                        }
                        break;
                    case "SMS":
                         DataSet smsds = new DataSet();
                        try
                        {
                            smsds = GetEmailOrSmsTemplates(context, 2, 0);
                            if (smsds != null)
                            {
                                if (smsds.Tables.Count > 1)
                                {
                                    if (smsds.Tables[0].Rows.Count > 0)
                                    {
                                        StrBuilder.Clear();
                                        StrBuilder.Append("<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button><h4 class='font-blue bold-6 mb-0'>Sms</h4></div>");
                                        StrBuilder.Append("<div class='modal-body'>");
                                        StrBuilder.Append("<table class='table no-border'><tr>");
                                        StrBuilder.Append("<td><label class='txt-grey'>To</label><select id='selSmsTo_" + nodeId + "' class='form-control selSmsTo' nodeId='" + nodeId + "'><option>Caller</option><option>Agent</option><option>Supervisor</option><option>Manager</option><option>Other</option></select></td>");
                                        StrBuilder.Append("<td><input type='text' class='form-control margin-top-25' placeholder='Enter mobile numbers seperated by a comma' id='txtSmsToOther_" + nodeId + "' style='display:none;'/></td></tr>");
                                        StrBuilder.Append("<tr>");
                                        StrBuilder.Append("<td><label class='txt-grey'>And also send SMS to</label><select id='selSmsCc_" + nodeId + "' class='form-control selSmsCc' nodeId='" + nodeId + "'><option>Caller</option><option>Agent</option><option>Supervisor</option><option>Manager</option><option>Other</option></select></td>");
                                        StrBuilder.Append("<td><input type='text'class='form-control margin-top-25' placeholder='Enter mobile numbers seperated by a comma' id='txtSmsCcOther_" + nodeId + "' style='display:none;' /></td></tr></table>");
                                        StrBuilder.Append("<div class='form-group'><label class='txt-grey'>Choose sms template</label><select id='selSmsTemplate_" + nodeId + "' nodeId='" + nodeId + "' class='form-control selSmsTemplate'>");
                                        StrBuilder.Append("<option value=''>Choose template</option>");
                                        for (int i = 0; i <= smsds.Tables[0].Rows.Count - 1; i++)
                                        {
                                            StrBuilder.Append("<option value='" + smsds.Tables[0].Rows[i]["Id"].ToString() + "'>" + smsds.Tables[0].Rows[i]["TemplateName"].ToString().ToString() + "</option>");
                                        }
                                        StrBuilder.Append("</select><textarea id='txtAreaSmsContent_" + nodeId + "' style='margin-top:10px;display:none;' class='form-control'></textarea></div><div class='errordiv text-center margin-top-10' nodeId='" + nodeId + "'></div></div>");
                                        StrBuilder.Append("<div class='modal-footer'><button type='button' class='btn green module-save' module='sms'>Save</button><button type='button' data-dismiss='modal' class='btn module-cancel' module='sms'>Cancel</button></div>"); 
                                    }
                                    else
                                    {
                                        StrBuilder.Append("<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button><h3>Sms</h3></div>");
                                        StrBuilder.Append("<div class='modal-body'>No Sms templates available</div>");
                                        resultObj = new JObject(new JProperty("Status", 2), new JProperty("Data", StrBuilder.ToString()));
                                        return resultObj;
                                    }
                                }
                                else
                                {
                                    StrBuilder.Append("<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button><h3>Sms</h3></div>");
                                    StrBuilder.Append("<div class='modal-body'>No Sms templates available</div>");
                                    resultObj = new JObject(new JProperty("Status", 2), new JProperty("Data", StrBuilder.ToString()));
                                    return resultObj;
                                }
                            }
                            else
                            {
                                StrBuilder.Append("<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button><h3>Sms</h3></div>");
                                StrBuilder.Append("<div class='modal-body'>No Sms templates available</div>");
                                resultObj = new JObject(new JProperty("Status", 2), new JProperty("Data", StrBuilder.ToString()));
                                return resultObj;
                            }
                            
                        } catch (Exception ex){
                            Logger.Error(ex.ToString());
                            resultObj = new JObject(new JProperty("Status", 0), new JProperty("ErrorReason", "Something Wrong With The Server"));
                            return resultObj;
                        }
                        break;
                }
                resultObj = new JObject(new JProperty("Status", 1), new JProperty("Data", StrBuilder.ToString()));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }

        public DataSet GetLoggedInAgents(HttpContext context)
        {
            DataSet ds = new DataSet();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                ds = managerObj.GetAccountAgents(MyConfig.MyConnectionString, accountId, agentId, roleId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return ds;
        }
        public DataSet GetEmailOrSmsTemplates(HttpContext context, int mode, int templateId)
        {
            DataSet ds = new DataSet();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                ds = managerObj.GetEmailOrSmsTemplates(MyConfig.MyConnectionString, accountId, mode, templateId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return ds;
        }
        public JObject GetEmailOrSmsTemplate(HttpContext context, int mode, int templateId)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                resultObj = managerObj.GetEmailOrSmsTemplate(MyConfig.MyConnectionString, accountId, mode, templateId);
                //if (resultObj != null)
                //{
                //    if (string.IsNullOrEmpty(Convert.ToString(resultObj.SelectToken("Success"))) == false)
                //    {
                //        if (resultObj.SelectToken("Success").ToString() == "True" && mode == 1)
                //        {
                //            if (string.IsNullOrEmpty(resultObj.SelectToken(@"Templates").ToString()) == false) {

                //            }
                //        }
                //    }
                //}
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public JObject GetTimeSlotTimings(HttpContext context, int timeSlotId)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                resultObj = managerObj.GetTimeSlotTimings(MyConfig.MyConnectionString, timeSlotId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public JObject GetTimeSlot(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                resultObj = managerObj.GetTimeSlot(MyConfig.MyConnectionString, accountId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public DataSet GetTimeSlots(HttpContext context)
        {
            DataSet ds = new DataSet();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                ds = managerObj.GetTimeSlots(MyConfig.MyConnectionString, accountId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return ds;
        }
        public JObject GetSkillGroups(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.SkillGroup skillGroupObj = new Press3.BusinessRulesLayer.SkillGroup();
                resultObj = skillGroupObj.GetSkillGroups(MyConfig.MyConnectionString, accountId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public DataSet GetSkillGroupsDs(HttpContext context)
        {
            DataSet ds = new DataSet();
            try
            {
                Press3.BusinessRulesLayer.SkillGroup skillGroupObj = new Press3.BusinessRulesLayer.SkillGroup();
                ds = skillGroupObj.GetSkillGroupsDs(MyConfig.MyConnectionString, accountId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return ds;
        }
        public DataSet GetStudioSkillGroups(HttpContext context, int studioId)
        {
            DataSet ds = new DataSet();
            try
            {
                Press3.BusinessRulesLayer.SkillGroup skillGroupObj = new Press3.BusinessRulesLayer.SkillGroup();
                ds = skillGroupObj.GetStudioSkillGroups(MyConfig.MyConnectionString, studioId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return ds;
        }
        public JObject DeleteStudio(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Studio studioObj = new BusinessRulesLayer.Studio();
                resultObj = studioObj.DeleteStudio(MyConfig.MyConnectionString, accountId, agentId, Convert.ToInt32(context.Request["studioId"]));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}