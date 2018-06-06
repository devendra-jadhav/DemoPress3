using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Press3.UserDefinedClasses
{
    public class Call
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
        public Nullable<System.DateTime> RingTime { get; set; }
        public Nullable<System.DateTime> AnswerTime { get; set; }
        public Nullable<System.DateTime> EndTime { get; set; }
        public Nullable<byte> HangupDispositionId { get; set; }
        public Nullable<System.DateTime> AgentConnectedTime { get; set; }
        public Nullable<int> AgentId { get; set; }
        public string Event { get; set; }
        public string EndReason { get; set; }
    }
}
