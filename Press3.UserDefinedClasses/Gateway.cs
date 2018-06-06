using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Press3.UserDefinedClasses
{
    public class Gateway
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Ip { get; set; }
        public Nullable<int> Port { get; set; }
        public string OriginationUrl { get; set; }
        public string RecordingPath { get; set; }
        public string ResourceUrl { get; set; }
        public bool IsActive { get; set; }
        public Nullable<int> AccountId { get; set; }
        public System.DateTime CreatedTime { get; set; }
        public Nullable<System.DateTime> UpdatedTime { get; set; }
        public string RangeCallerIds { get; set; }
        public string IndividualCallerIds { get; set; }
        public string DeletedCallerIds { get; set; }
        public int TotalChannels { get; set; }
    }
}
