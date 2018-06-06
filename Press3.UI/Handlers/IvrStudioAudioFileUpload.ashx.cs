using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Press3.UI.CommonClasses;
using NAudio.Wave;
using System.Data;
using System.Data.SqlClient;
using System.Text.RegularExpressions;
using System.Runtime.InteropServices;
using System.IO;
using System.Web.SessionState;
using Newtonsoft.Json.Linq;
using Press3.UserDefinedClasses;
using Press3.Utilities;

namespace Press3.UI.Handlers
{
    /// <summary>
    /// Summary description for IvrStudioAudioFileUpload
    /// </summary>
    public class IvrStudioAudioFileUpload : IHttpHandler, IRequiresSessionState
    {
        public JObject jObj = new JObject();
        public void ProcessRequest(HttpContext context)
        {
            if (context.Session["AccountId"] == null)
            {
                //context.Response.Write(new JObject(new JProperty("Status", 0), new JProperty("ErrorReason", "Session expired.")));
                HttpContext.Current.Response.StatusCode = 401;
                return;
            }
            HttpPostedFile postedfile = default(HttpPostedFile);

            try {
                postedfile = context.Request.Files[0];
                string filename = postedfile.FileName.Substring(0, postedfile.FileName.LastIndexOf("."));
                Press3.UserDefinedClasses.Validator validateObject = new Press3.UserDefinedClasses.Validator();
                string ValidateResponse = "";

                if (!ValidateFileName(filename))
                {
                    jObj = new JObject(new JProperty("Status", 0), new JProperty("ErrorReason", "File name should not contain  i) Morethan one dot ii)Comma."));
                    context.Response.Write(jObj);
                    return;
                }
               
                ValidateResponse = validateObject.TextValidate(filename, "PLAINTEXT");

                if (ValidateResponse.ToString().ToUpper() != "OK")
                {
                    jObj = new JObject(new JProperty("Status", 0), new JProperty("ErrorReason", "Invalid Characters Found In File Name Field"));
                    context.Response.Write(jObj);
                    return;
                }

                if (Path.GetExtension(postedfile.FileName).ToLower() != ".mp3" && Path.GetExtension(postedfile.FileName).ToLower() != ".wav")
                {
                    jObj = new JObject(new JProperty("Status", 0), new JProperty("ErrorReason", "Invalid  file extension,Please upload mp3 or wav file."));
                    context.Response.Write(jObj);
                    return;
                }

                if (!(postedfile.ContentType == "audio/mpeg") && postedfile.ContentType == "audio/x-wav" && postedfile.ContentType == "audio/mpeg3" && postedfile.ContentType == "audio/wav" && postedfile.ContentType == "audio/x-pn-wav")
                {
                    jObj = new JObject(new JProperty("Status", 0), new JProperty("ErrorReason", "Invalid file, Please check once."));
                    context.Response.Write(jObj);
                    return;
                }

                string fileName = null;
                HttpPostedFileBase filebase = new HttpPostedFileWrapper(postedfile);
                byte[] buffer = new byte[512];
                filebase.InputStream.Read(buffer, 0, 512);
                string content = System.Text.Encoding.UTF8.GetString(buffer);
                //if (Regex.IsMatch(content, "<|><script|<html|<head|<title|<body|<pre|<table|<a\\s+href|<img|<plaintext|<cross\\-domain\\-policy", RegexOptions.IgnoreCase | RegexOptions.CultureInvariant | RegexOptions.Multiline))
                //{
                //    jObj = new JObject(new JProperty("Status", 0), new JProperty("ErrorReason", "Uploaded file contains Invalid data, please check once."));
                //    context.Response.Write(jObj);
                //    return;
                //}

                if (HttpContext.Current.Request.Browser.Browser.ToUpper() == "IE")
                {
                    string[] files = postedfile.FileName.Split(new char[] { '\\' });
                    fileName = files[files.Length - 1];
                }
                else
                {
                    fileName = postedfile.FileName;
                }

                fileName = Regex.Replace(fileName, "[^A-Za-z0-9_.]", "");
                string voice_ext = fileName.Substring(fileName.IndexOf("."), (fileName.Length - fileName.IndexOf("."))).ToLower();
                string voice_clip_name = fileName.Substring(0, fileName.LastIndexOf("."));
                string TimeSpan = DateTime.Now.ToString("ddhhmmss");
                string spath = null;
                string patha = null;
                spath = context.Server.MapPath("~/VoiceClips/");
                patha = spath + voice_clip_name + "_" + TimeSpan + voice_ext;
                postedfile.SaveAs(patha);

                try
                    {
                        object clip = "";
                        string fileNameWithPath = null;
                        if ((System.IO.File.Exists(spath + voice_clip_name + "_" + TimeSpan + ".mp3")))
                        {
                            fileNameWithPath = spath + voice_clip_name + "_" + TimeSpan + ".mp3";
                            clip = fileNameWithPath.Substring((fileNameWithPath.LastIndexOf("\\") + 1), fileNameWithPath.Length - (fileNameWithPath.LastIndexOf("\\") + 1));
                            jObj = new JObject(new JProperty("Status", 1), new JProperty("Clip", clip.ToString()));
                        }
                        else if ((System.IO.File.Exists(spath + voice_clip_name + "_" + TimeSpan + ".wav")))
                        {
                            fileNameWithPath = spath + voice_clip_name + "_" + TimeSpan + ".wav";
                            clip = fileNameWithPath.Substring((fileNameWithPath.LastIndexOf("\\") + 1), fileNameWithPath.Length - (fileNameWithPath.LastIndexOf("\\") + 1));
                            jObj = new JObject(new JProperty("Status", 1), new JProperty("Clip", clip.ToString()));
                        }
                        else
                        {
                            jObj = new JObject(new JProperty("Status", 0), new JProperty("ErrorReason", "Something went wrong with the server."));
                        }
                        context.Response.Write(jObj);
                    }
                catch(Exception ex){
                    Logger.Error(ex.ToString());
                    jObj = new JObject(new JProperty("Status", 0), new JProperty("ErrorReason", "Something went wrong with the server."));
                    context.Response.Write(jObj);
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                jObj = new JObject(new JProperty("Status", 0), new JProperty("ErrorReason", "Something went wrong with the server."));
                context.Response.Write(jObj);
            }
        }
        public bool ValidateFileName(string FileName)
        {
            bool IsValid = true;
            try
            {
                if (FileName.Contains("..") || FileName.Contains(",") || FileName.Contains("."))
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                IsValid = false;
            }
            return IsValid;
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