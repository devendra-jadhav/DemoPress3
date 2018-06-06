using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Press3.UserDefinedClasses
{
    public class OutboundCommunicationSettings
    {
        public int Mode { get; set; }
        public int AccountId { get; set; }
        public int AgentId { get; set; }
        public int CallerId { get; set; }
        public int SenderId { get; set; }
        public bool IsCall { get; set; }
        public bool IsSenderId { get; set; }
        public byte EmailType { get; set; }
        public string Ip { get; set; }
        public int Port { get; set; }
        public string AWSKey { get; set; }
        public string AWSSecret { get; set; }
        public string FromEmailAddress { get; set; }
    }
}
