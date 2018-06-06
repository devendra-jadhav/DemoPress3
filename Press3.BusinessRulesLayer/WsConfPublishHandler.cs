using System;
using System.Web;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
namespace Press3.BusinessRulesLayer
{
    public class WsConfPublishHandler : IHttpHandler
    {
        private String remoteHost;
        private String remotePort;
        public void ProcessRequest(HttpContext context)
        {
            if (context.IsWebSocketRequest)
            {
                remoteHost = context.Request.ServerVariables["REMOTE_ADDR"];
                remotePort = context.Request.ServerVariables["REMOTE_PORT"];
                context.AcceptWebSocketRequest(HandleWebSocket);
            }
            else
            {
                context.Response.StatusCode = 400;
            }
        }
        private async Task HandleWebSocket(WebSocketContext wsContext)
        {
            const int maxMessageSize = 1024;
            byte[] receiveBuffer = new byte[maxMessageSize];
            WebSocket pubSocket = wsContext.WebSocket;

            String sendLog = "PubSocket-->{\"Action\" : \"open\",\"host\":\" "
                + remoteHost + "\",\"port\": "
                + remotePort + ", \"subscribe\":"
                + "}";
            ArraySegment<byte> welcomeBuffer = new ArraySegment<byte>(Encoding.UTF8.GetBytes(sendLog));
            await pubSocket.SendAsync(welcomeBuffer, WebSocketMessageType.Text, true, CancellationToken.None);

            while (pubSocket.State == WebSocketState.Open)
            {
                WebSocketReceiveResult receiveResult = await pubSocket.ReceiveAsync(new ArraySegment<byte>(receiveBuffer), CancellationToken.None);
                if (receiveResult.MessageType == WebSocketMessageType.Close)
                {
                    await pubSocket.CloseOutputAsync(WebSocketCloseStatus.NormalClosure, string.Empty, CancellationToken.None);
                }
                else if (receiveResult.MessageType == WebSocketMessageType.Binary)
                {
                    await pubSocket.CloseAsync(WebSocketCloseStatus.InvalidMessageType, "Binary frame not allowed", CancellationToken.None);
                }
                else
                {
                    int count = receiveResult.Count;
                    while (receiveResult.EndOfMessage == false)
                    {
                        if (count >= maxMessageSize)
                        {
                            string closeMessage = string.Format("Max message size: {0} bytes.", maxMessageSize);
                            await pubSocket.CloseAsync(WebSocketCloseStatus.MessageTooBig, closeMessage, CancellationToken.None);
                            return;
                        }
                        receiveResult = await pubSocket.ReceiveAsync(new ArraySegment<byte>(receiveBuffer, count, maxMessageSize - count), CancellationToken.None);
                        count += receiveResult.Count;
                    }
                    var receivedJson = Encoding.UTF8.GetString(receiveBuffer, 0, count);
                    await OnMessage(pubSocket, receivedJson);
                }
            }
            //out of while loop
        }
        Func<String, WsConfPubSubState> ValueFactory1 = delegate(String ChannelName)
        {
            //GetInitialCounts();
            return new WsConfPubSubState(ChannelName);
        };

        Func<String, WsConfPubSubState> ValueFactory = (ChannelName) =>
        {
            //GetInitialCounts();
            return new WsConfPubSubState(ChannelName);
        };

        public async Task OnMessage(WebSocket pubSocket, string message)
        {

            try
            {
                JObject jobj = JObject.Parse(message);
                JToken room;

                if (jobj.TryGetValue("Channel_Name", out room))
                {
                    WsConfPubSubState confState;
                    if (!WsConfSubscriberHandler.channels.TryGetValue(room.ToString(), out confState))
                    {
                        confState = WsConfSubscriberHandler.channels.GetOrAdd(room.ToString(), ValueFactory(room.ToString()));
                    }

                    try
                    {
                        await confState.BroadcastToSubscribers(message);
                    }
                    catch (InvalidOperationException e)
                    {
                        // logger.Error("Error onMessage :", e);
                    }
                    String msgReply = jobj.GetValue("requestId") + " subscribers count";
                    ArraySegment<byte> msgReplyBuffer = new ArraySegment<byte>(Encoding.UTF8.GetBytes(msgReply));
                    await pubSocket.SendAsync(msgReplyBuffer, WebSocketMessageType.Text, true, CancellationToken.None);
                }
            }
            catch (Exception e)
            {
                String exception = "Exception :" + e.ToString();
                //logger.Error("Error onMessage :", e);
                ArraySegment<byte> exceptionBuffer = new ArraySegment<byte>(Encoding.UTF8.GetBytes(exception));
                Task t = pubSocket.SendAsync(exceptionBuffer, WebSocketMessageType.Text, true, CancellationToken.None);

            }
        }


        public bool IsReusable
        {
            get { return false; }
        }
    }
}

