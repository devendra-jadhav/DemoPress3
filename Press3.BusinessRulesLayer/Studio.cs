using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using Press3.Utilities;
using System.Data;
using UDC = Press3.UserDefinedClasses;
using System.Xml;
using NAudio.Wave;
using System.Net;
using System.IO;
using RestSharp.Contrib;
using System.Collections;

namespace Press3.BusinessRulesLayer
{
    public class Studio
    {
         private Helper helper = null;
         public Studio()
        {
            helper = new Helper();
            helper.ResponseFormat = "json";
            helper.InitializeResponseVariables();
        }

         public JObject CreateStudio(String connection, UDC.Studio studio)
         {
             try
             {

                 JObject jsonObj = default(JObject);
                 jsonObj = new JObject();
                 jsonObj = JObject.Parse(studio.StudioData);
                 List<JToken> results = jsonObj.Children().ToList();
                 ArrayList new_nodes = new ArrayList();

                 DataTable table = new DataTable("temp_ivr_flows");
                 DataColumn col1 = new DataColumn("node_id", System.Type.GetType("System.Int32"));
                 DataColumn col2 = new DataColumn("node_type", System.Type.GetType("System.String"));
                 DataColumn col3 = new DataColumn("xml_data", System.Type.GetType("System.String"));
                 table.Columns.Add(col1);
                 table.Columns.Add(col2);
                 table.Columns.Add(col3);
                 int i = 1;
                 foreach (JProperty item in results)
                 {
                     new_nodes.Add(Convert.ToInt32(item.Name));
                     object[] val = new object[3];
                     val[0] = item.Name;
                     val[1] = item.Value["type"].ToString();
                     val[2] = item.Value["data"].ToString();
                     table.Rows.Add(val);
                     i = i + 1;
                 }

                 XmlDocument xmlobj = new XmlDocument();
                 xmlobj.LoadXml(studio.StudioXml);

                 Press3.DataAccessLayer.Studio studioObj = new Press3.DataAccessLayer.Studio(connection);
                 DataSet ds = studioObj.CreateOrUpdateStudio(studio, table);
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
                 Logger.Error("Exception In BAL.CreateStudio " + ex.ToString());
             }
             return helper.GetResponse();
         }

         public JObject GetStudioDetails(String connection, int accountId, int studioId)
         {
             try
             {
                 Press3.DataAccessLayer.Studio studioObj = new Press3.DataAccessLayer.Studio(connection);
                 DataSet ds = studioObj.GetStudioDetails(accountId, studioId);
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
                 Logger.Error("Exception In BAL.GetStudioDetails " + ex.ToString());
             }
             return helper.GetResponse();
         }
         public JObject GetStudioNodeDetails(String connection, int accountId, int studioId, int nodeId, int mode)
         {
             try
             {
                 Press3.DataAccessLayer.Studio studioObj = new Press3.DataAccessLayer.Studio(connection);
                 DataSet ds = studioObj.GetStudioNodeDetails(accountId, studioId, nodeId, mode);
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
                 Logger.Error("Exception In BAL.GetStudioDetails " + ex.ToString());
             }
             return helper.GetResponse();
         }
         public JObject ConvertTextToSpeech(String connection, string clipPath, Int32 accountId, string language, string message)
        {
            JObject JObj = new JObject();

            WaveFileReader wf = default(WaveFileReader);
            int min = 0;
            int sec = 0;
            int durationinsec = 0;
            string retrun_msg = "";
            JArray Jarr = new JArray();

            try 
            {
             HttpWebResponse obresponse = default(HttpWebResponse);
             HttpWebRequest obrequest = default(HttpWebRequest);
             StreamWriter strwriter = default(StreamWriter);
             StreamReader strreader = default(StreamReader);
             string result = null;
             string parameters_string = null;
             string lang_string = null;
             //Response.Write(language)
             //Exit Sub
             lang_string = HttpUtility.UrlEncode(message, UTF8Encoding.UTF8);

             parameters_string = "utf8=" + lang_string + "&lang=" + language + "&apikey=50921223c3f9cef89e8a3c6c91e4db4481f41442dfd97";
             obrequest = (HttpWebRequest)WebRequest.Create("http://msg2voice.com/aspeak/php/aspeak.php");
             obrequest.Method = "POST";
             obrequest.ContentType = "application/x-www-form-urlencoded";
             strwriter = new StreamWriter(obrequest.GetRequestStream());
             strwriter.Write(parameters_string);
             strwriter.Flush();
             strwriter.Close();
             obresponse = (HttpWebResponse)obrequest.GetResponse();
             strreader = new StreamReader(obresponse.GetResponseStream());
             result = strreader.ReadToEnd();
             //Response.Write(result)
             XmlDocument xmlDoc = new XmlDocument();
             XmlElement xmlRoot = default(XmlElement);
             xmlDoc.LoadXml(result);
             xmlRoot = xmlDoc.DocumentElement;
             XmlNode status_alert = xmlRoot.FirstChild;
             string success_status = status_alert.ChildNodes[0].InnerText;
             string voice_url = status_alert.NextSibling.InnerText;
             WebClient fileReader = new WebClient();
             string filename = voice_url.Substring(voice_url.LastIndexOf("/") + 1);
             string timespan = DateTime.Now.ToString("yyMMddHHmmss");

             try
             {
                 if (!(System.IO.File.Exists(clipPath + filename.ToString() + ".mp3")))
                 {
                     fileReader.DownloadFile(voice_url, clipPath + "TTS_" + timespan.ToString() + ".mp3");
                     //filename)
                     wf = new WaveFileReader(clipPath + "TTS_" + timespan.ToString() + ".mp3");
                     min = wf.TotalTime.Minutes;
                     min = min * 60;
                     sec = wf.TotalTime.Seconds;
                     durationinsec = min + sec;

                     retrun_msg = "OK"; //insert_into_database("TTS_" + timespan + ".mp3", durationinsec);
                     if (retrun_msg == "OK")
                     {
                         JObj = new JObject(new JProperty("Status", 1), new JProperty("clip", "TTS_" + timespan.ToString() + ".mp3"));

                         //   Response.Write("{""clip"":""TTS_" + timespan.ToString() + ".mp3"",""status"":""OK""}")
                     }
                     else
                     {
                         // Response.Write("{""status"":""NO""}")
                         JObj = new JObject(new JProperty("Status", 0), new JProperty("ErrorReason", "Something Went Wrong With The Server"));
                     }

                 }
                 else
                 {
                     fileReader.DownloadFile(voice_url, clipPath + "TTS_" + timespan + "(1)");
                     wf = new WaveFileReader(clipPath + "TTS_" + timespan + "(1)");
                     min = wf.TotalTime.Minutes;
                     min = min * 60;
                     sec = wf.TotalTime.Seconds;
                     durationinsec = min + sec;
                     retrun_msg = "OK"; //insert_into_database("TTS_" + timespan + ".mp3", durationinsec);
                     if (retrun_msg == "OK")
                     {
                         JObj = new JObject(new JProperty("Status", 1), new JProperty("clip", "TTS_" + timespan.ToString() + ".mp3"));
                     }
                     else
                     {
                         JObj = new JObject(new JProperty("Status", 0), new JProperty("ErrorReason", "Something Went Wrong With The Server"));
                     }
                 }

             }
             catch (Exception ex)
             {
                 Logger.Error(ex.ToString());
                 JObj = new JObject(new JProperty("Status", 0), new JProperty("ErrorReason", "Something Went Wrong With The Server"));
             }
            }
            catch (Exception ex){
                Logger.Error("Exception In BAL.ConvertTextToSpeech " + ex.ToString());
                JObj = new JObject(new JProperty("Status", 0), new JProperty("ErrorReason", "Something Went Wrong With The Server"));
            }
            return JObj;
        }
         public JObject GetAccountCallerIds(String connection, int accountId)
         {
             try
             {
                 Press3.DataAccessLayer.Studio studioObj = new Press3.DataAccessLayer.Studio(connection);
                 DataSet ds = studioObj.GetAccountCallerIds(accountId);
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
                 Logger.Error("Exception In BAL.GetAccountCallerIds " + ex.ToString());
             }
             return helper.GetResponse();
         }
         public JObject GetAccountStudioPurposes(String connection, int accountId)
         {
             try
             {
                 Press3.DataAccessLayer.Studio studioObj = new Press3.DataAccessLayer.Studio(connection);
                 DataSet ds = studioObj.GetAccountStudioPurposes(accountId);
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
                 Logger.Error("Exception In BAL.GetAccountStudioPurposes " + ex.ToString());
             }
             return helper.GetResponse();
         }
         public JObject GetStudioGenericDetails(String connection, int studioId)
         {
             try
             {
                 Press3.DataAccessLayer.Studio studioObj = new Press3.DataAccessLayer.Studio(connection);
                 DataSet ds = studioObj.GetStudioGenericDetails(studioId);
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
                 Logger.Error("Exception In BAL.GetStudioGenericDetails " + ex.ToString());
             }
             return helper.GetResponse();
         }
         public JObject GetStudios(String connection, int accountId)
         {
             try
             {
                 Press3.DataAccessLayer.Studio studioObj = new Press3.DataAccessLayer.Studio(connection);
                 DataSet ds = studioObj.GetStudios(accountId);
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
                 Logger.Error("Exception In BAL.GetStudios " + ex.ToString());
             }
             return helper.GetResponse();
         }
         public JObject CreateOrUpdateStudioGenericDetails(String connection, UDC.Studio studio)
         {
             try
             {
                 Press3.DataAccessLayer.Studio studioObj = new Press3.DataAccessLayer.Studio(connection);
                 DataSet ds = studioObj.CreateOrUpdateStudioGenericDetails(studio);
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
                 Logger.Error("Exception In BAL.CreateOrUpdateStudioGenericDetails " + ex.ToString());
             }
             return helper.GetResponse();
         }
         public JObject UpdateStudioCallerIdNumber(String connection, UDC.StudioCallerId studioCallerId)
         {
             try
             {
                 Press3.DataAccessLayer.Studio studioObj = new Press3.DataAccessLayer.Studio(connection);
                 DataSet ds = studioObj.UpdateStudioCallerIdNumber(studioCallerId);
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
                 Logger.Error("Exception In BAL.UpdateStudioCallerIdNumber " + ex.ToString());
             }
             return helper.GetResponse();
         }

         public JObject DeleteStudio(string connection, int accountId, int agentId, int studioId)
         {
             try
             {
                 Press3.DataAccessLayer.Studio studioObj = new Press3.DataAccessLayer.Studio(connection);
                 DataSet ds = studioObj.DeleteStudio(accountId, agentId, studioId);
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
                 Logger.Error("Exception In BAL.DeleteStudio " + ex.ToString());
             }
             return helper.GetResponse();
         }
    }
}
