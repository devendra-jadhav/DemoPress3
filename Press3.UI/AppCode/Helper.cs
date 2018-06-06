using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json.Linq;
using System.Xml;
using System.IO;
using System.Reflection;
using Press3.Utilities;

namespace Press3.UI.AppCode
{
    public class Helper
    {
            public Helper()
            {
                this.Ip = HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
                //this.IpNumber = ConvertIpAdressToNumber(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"].ToString());
                this.IpNumber = ConvertIpAdressToNumber("183.82.2.22");
                InitializeResponseVariables();
            }

            private JObject jObj = null;
            private JArray jArr = null;
            private XmlDocument xmlDoc = null;
            private XmlElement rootElement = null;

            public void TerminateRequest(int statusCode, int subStatusCode = -1, string statusDescription = "", bool clearResponse = true, string displayText = "")
            {
                if (clearResponse)
                {
                    HttpContext.Current.Response.Clear();
                }
                HttpContext.Current.Response.StatusCode = statusCode;
                switch (this.ResponseFormat)
                {
                    case Press3.Utilities.ResponseFormat.JSON:
                        HttpContext.Current.Response.ContentType = "application/json";
                        break;
                    case Press3.Utilities.ResponseFormat.XML:
                        HttpContext.Current.Response.ContentType = "application/xml";
                        break;
                    default:
                        HttpContext.Current.Response.ContentType = "text/html";
                        break;
                }
                if (subStatusCode > -1)
                {
                    HttpContext.Current.Response.SubStatusCode = subStatusCode;
                }
                if (statusDescription.Length > 0)
                {
                    HttpContext.Current.Response.StatusDescription = "";
                }
                if (displayText.Length > 0)
                {
                    if (this.ResponseFormat == Press3.Utilities.ResponseFormat.XML)
                    {
                        XmlDocument xmlDoc = new XmlDocument();
                        xmlDoc.LoadXml(displayText);
                        XmlNodeList nodes = xmlDoc.GetElementsByTagName("StatusCode");
                        if (nodes.Count > 0)
                        {
                            XmlNode node = nodes[0];
                            node.ParentNode.RemoveChild(node);
                        }
                        if (xmlDoc.SelectSingleNode("/Response/ApiId") == null && HttpContext.Current.Items["RequestID"] != null)
                        {
                            //XmlElement apiIdElement = xmlDoc.CreateElement("ApiId", HttpContext.Current.Items["RequestID"].ToString());
                            XmlElement apiIdElement = xmlDoc.CreateElement("ApiId");
                            apiIdElement.InnerText = HttpContext.Current.Items["RequestID"].ToString();
                            xmlDoc.FirstChild.PrependChild(apiIdElement);
                        }
                        HttpContext.Current.Response.Write(xmlDoc.InnerXml);
                    }
                    else
                    {
                        JObject jObj = JObject.Parse(displayText);
                        if (jObj.SelectToken("StatusCode") != null)
                        {
                            jObj.Remove("StatusCode");
                        }
                        if (jObj.SelectToken("ApiId") == null && HttpContext.Current.Items["RequestID"] != null)
                        {
                            jObj.AddFirst(new JProperty("ApiId", HttpContext.Current.Items["RequestID"].ToString()));
                        }
                        HttpContext.Current.Response.Write(jObj);
                    }


                }
                HttpContext.Current.Response.End();
            }

            public int GetStatusCode(string data)
            {
                int statusCode;
                if (this.ResponseFormat == Press3.Utilities.ResponseFormat.XML)
                {
                    XmlDocument xmlDoc = new XmlDocument();
                    xmlDoc.LoadXml(data.ToString());
                    XmlNodeList node = xmlDoc.GetElementsByTagName("StatusCode");
                    if (node.Count > 0)
                        statusCode = Convert.ToInt16(node.Item(0).InnerText);
                    else
                        statusCode = 200;
                }
                else
                {
                    JObject jobj = JObject.Parse(data);
                    if (jobj.SelectToken("StatusCode") != null)
                        statusCode = Convert.ToInt16(jobj.SelectToken("StatusCode").ToString());
                    else
                        statusCode = 200;
                }
                return statusCode;
            }
            public int GetStatusCode(ref dynamic result, bool removeKey)
            {
                int statusCode = 200;
                if (this.ResponseFormat == Press3.Utilities.ResponseFormat.XML)
                {
                    XmlDocument tempXmlDocument = new XmlDocument();
                    tempXmlDocument.LoadXml(result);
                    if (tempXmlDocument.GetElementsByTagName("StatusCode").Count > 0)
                    {
                        statusCode = Convert.ToInt16(tempXmlDocument.GetElementsByTagName("StatusCode")[0].InnerText);
                        if (removeKey)
                        {
                            tempXmlDocument.GetElementsByTagName("StatusCode")[0].ParentNode.RemoveChild(tempXmlDocument.GetElementsByTagName("StatusCode")[0]);
                        }
                    }
                    result = tempXmlDocument.InnerXml as dynamic;
                }
                else
                {
                    JObject tempJObject = JObject.Parse(result.ToString());
                    if (tempJObject.SelectToken("StatusCode") != null)
                    {
                        statusCode = Convert.ToInt16(tempJObject.SelectToken("StatusCode").ToString());
                        if (removeKey)
                        {
                            tempJObject.Remove("StatusCode");
                        }
                    }
                    result = tempJObject as dynamic;
                }
                return statusCode;
            }
            public int GetSubStatusCode(ref dynamic result, bool removeKey)
            {
                int subStatusCode = 200;
                if (this.ResponseFormat == Press3.Utilities.ResponseFormat.XML)
                {
                    XmlDocument tempXmlDocument = new XmlDocument();
                    tempXmlDocument.LoadXml(result);
                    if (tempXmlDocument.GetElementsByTagName("SubStatusCode").Count > 0 && !DBNull.Value.Equals(tempXmlDocument.GetElementsByTagName("SubStatusCode")) && int.TryParse(tempXmlDocument.GetElementsByTagName("SubStatusCode")[0].InnerText, out subStatusCode))
                    {
                        subStatusCode = Convert.ToInt16(tempXmlDocument.GetElementsByTagName("SubStatusCode")[0].InnerText);
                        if (removeKey)
                        {
                            tempXmlDocument.GetElementsByTagName("SubStatusCode")[0].ParentNode.RemoveChild(tempXmlDocument.GetElementsByTagName("SubStatusCode")[0]);
                        }
                    }
                    result = tempXmlDocument.InnerXml as dynamic;
                }
                else
                {
                    JObject tempJObject = JObject.Parse(result.ToString());
                    if (tempJObject.SelectToken("SubStatusCode") != null && !DBNull.Value.Equals(tempJObject.SelectToken("SubStatusCode")) && int.TryParse(tempJObject.SelectToken("SubStatusCode").ToString(), out subStatusCode))
                    {
                        subStatusCode = Convert.ToInt16(tempJObject.SelectToken("SubStatusCode").ToString());
                        if (removeKey)
                        {
                            tempJObject.Remove("SubStatusCode");
                        }
                    }
                    result = tempJObject as dynamic;
                }
                return subStatusCode;
            }

            public void InitializeResponseVariables()
            {
                if (this.ResponseFormat == Press3.Utilities.ResponseFormat.XML)
                {
                    xmlDoc = new XmlDocument();
                    rootElement = xmlDoc.CreateElement("Response");
                    xmlDoc.AppendChild(rootElement);
                }
                else
                {
                    jObj = new JObject();
                    jArr = new JArray();
                }
            }

            public void CreateProperty(string key, object value, bool isInsertFirst = false)
            {
                if (this.ResponseFormat == Press3.Utilities.ResponseFormat.XML)
                {
                    XmlElement tempElement = xmlDoc.CreateElement(key);
                    tempElement.InnerText = value.ToString();
                    if (isInsertFirst)
                    {
                        rootElement.PrependChild(tempElement);
                    }
                    else
                    {
                        rootElement.AppendChild(tempElement);
                    }
                }
                else
                {
                    if (isInsertFirst)
                    {
                        jObj.AddFirst(new JProperty(key, value));
                    }
                    else
                    {
                        jObj.Add(new JProperty(key, value));
                    }
                }
            }
            public dynamic GetResponse()
            {
                if (this.ResponseFormat == Press3.Utilities.ResponseFormat.XML)
                {
                    if (xmlDoc.SelectNodes("/Response/ApiId").Count == 0 && HttpContext.Current.Items["RequestID"] != null)
                    {
                        XmlElement element = xmlDoc.CreateElement("ApiId");
                        element.InnerText = HttpContext.Current.Items["RequestID"].ToString();
                        xmlDoc.ChildNodes[0].AppendChild(element);
                    }
                    return xmlDoc.InnerXml;
                }
                else
                {
                    if (jObj.SelectToken("ApiId") == null && HttpContext.Current.Items["RequestID"] != null)
                    {
                        jObj.AddFirst(new JProperty("ApiId", HttpContext.Current.Items["RequestID"].ToString()));
                    }
                    return jObj;
                }
            }
            public ulong ConvertIpAdressToNumber(string strIP)
            {
                ulong ipNum = 0;
                System.Net.IPAddress address;


                if (System.Net.IPAddress.TryParse(strIP, out address))
                {
                    byte[] addrBytes = address.GetAddressBytes();

                    if (System.BitConverter.IsLittleEndian)
                    {
                        System.Collections.Generic.List<byte> byteList = new System.Collections.Generic.List<byte>(addrBytes);
                        byteList.Reverse();
                        addrBytes = byteList.ToArray();
                    }

                    if (addrBytes.Length > 8)
                    {
                        this.IsV6 = true;
                        ipNum = System.BitConverter.ToUInt64(addrBytes, 8);
                        ipNum <<= 64;
                        ipNum += System.BitConverter.ToUInt64(addrBytes, 0);
                    }
                    else
                    {
                        this.IsV6 = false;
                        ipNum = System.BitConverter.ToUInt32(addrBytes, 0);
                    }
                }
                return ipNum;
            }
            public string ResponseFormat { get; set; }
            public string RequestFormat { get; set; }
            public string Ip { get; set; }
            public string EndPointUri { get; set; }
            public ulong IpNumber { get; set; }
            public bool IsV6 { get; set; }
        }
    }