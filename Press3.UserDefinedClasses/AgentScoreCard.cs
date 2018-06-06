using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Press3.UserDefinedClasses
{
    public class AgentScoreCard
    {
        public int Id { get; set; }
        public int AccountId { get; set; }
        public int AgentId { get; set; }
        public int CallId { get; set; }
        public int ScoreCardId {get; set;}
        public int ScoredBy { get; set; }
        public double TotalScore { get; set; }
        public double OutOfScore { get; set; }
        public double Rating { get; set; }
        public string Comments { get; set; }
        public string Scores { get; set; }
        public bool IsDraft { get; set; }
    }
}
