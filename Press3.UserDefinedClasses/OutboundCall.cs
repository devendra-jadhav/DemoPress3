using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Press3.UserDefinedClasses
{
    public class OutboundCall
    {
        public decimal Id { get; set; }
        public int StudioId { get; set; }
        public string Source { get; set; }
        public string Destination { get; set; }
        public string CallUUID { get; set; }
        public int GatewayId { get; set; }
        public bool IsOutBound { get; set; }
        public Nullable<decimal> AccountCustomerId { get; set; }
        public byte StatusId { get; set; }
        public System.DateTime CreatedTime { get; set; }
        public int RingTime { get; set; }
        public int AnswerTime { get; set; }
        public int EndTime { get; set; }
        public Nullable<byte> HangupDispositionId { get; set; }
        public Nullable<System.DateTime> AgentConnectedTime { get; set; }
        public Nullable<int> AgentId { get; set; }
        public string Event { get; set; }
        public string EndReason { get; set; }
        public string ConferenceAction { get; set; }
        public string RequestUUID { get; set; }
        public int FsMemberId { get; set; }
        public bool IsCustomer { get; set; }
        public Int64 EventTimeStamp { get; set; }
        public string ConferenceName { get; set; }
        public string HangupDisposition { get; set; }
    }
}
