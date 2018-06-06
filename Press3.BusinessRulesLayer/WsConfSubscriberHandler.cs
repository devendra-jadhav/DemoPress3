using System;
using System.Web;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Concurrent;

namespace Press3.BusinessRulesLayer
{
    public class WsConfSubscriberHandler : IHttpHandler
    {
        public static ConcurrentDictionary<String, WsConfPubSubState> channels = new ConcurrentDictionary<String, WsConfPubSubState>();
        private String channelName;
        private String remoteHost;
        private String remotePort;
        public void ProcessRequest(HttpContext context)
        {

            if (context.IsWebSocketRequest)
            {
                channelName = context.Request.QueryString["Channel_Name"];
                remoteHost = context.Request.ServerVariables["REMOTE_ADDR"];
                remotePort = context.Request.ServerVariables["REMOTE_PORT"];
                context.AcceptWebSocketRequest(HandleWebSocket);
            }
            else
            {
                Press3.Utilities.Logger.Error("Not a webSocket Request: " + context.Request.RawUrl, true);
                context.Response.StatusCode = 400;
            }

        }

        private async Task HandleWebSocket(WebSocketContext wsContext)
        {
            const int maxMessageSize = 102400;
            byte[] receiveBuffer = new byte[maxMessageSize];
            WebSocket subSocket = wsContext.WebSocket;
            WsConfSubscriber subscriber = new WsConfSubscriber(subSocket);
            await OnOpen(subscriber);
            while (true)
            {
                WebSocketReceiveResult receiveResult = null;
                try
                {
                    receiveResult = await subSocket.ReceiveAsync(new ArraySegment<byte>(receiveBuffer), CancellationToken.None);
                }
                catch (WebSocketException wse)
                {
                    OnClose(subscriber, WebSocketCloseStatus.InvalidMessageType);

                    break;
                }

                if (receiveResult.MessageType == WebSocketMessageType.Close)
                {
                    OnClose(subscriber, receiveResult.CloseStatus.Value);
                    await subSocket.CloseOutputAsync(WebSocketCloseStatus.NormalClosure, string.Empty, CancellationToken.None);
                }
                else if (receiveResult.MessageType == WebSocketMessageType.Binary)
                {
                    OnClose(subscriber, WebSocketCloseStatus.InvalidMessageType);
                    await subSocket.CloseAsync(WebSocketCloseStatus.InvalidMessageType, "Binary frame not allowed", CancellationToken.None);
                }
                else
                {
                    int count = receiveResult.Count;
                    while (receiveResult.EndOfMessage == false)
                    {
                        if (count >= maxMessageSize)
                        {
                            string closeMessage = string.Format("Max message size: {0} bytes.", maxMessageSize);
                            OnClose(subscriber, WebSocketCloseStatus.MessageTooBig);
                            await subSocket.CloseAsync(WebSocketCloseStatus.MessageTooBig, closeMessage, CancellationToken.None);
                            return;
                        }
                        receiveResult = await subSocket.ReceiveAsync(new ArraySegment<byte>(receiveBuffer, count, maxMessageSize - count), CancellationToken.None);
                        if (receiveResult.Count == 0)
                        {

                        }
                        count += receiveResult.Count;
                    }
                    //var receivedString = Encoding.UTF8.GetString(receiveBuffer, 0, count);
                }
            }
            //WebSocket socket = context.WebSocket;
            //while (true)
            //{
            //    ArraySegment<byte> buffer = new ArraySegment<byte>(new byte[1024]);
            //    WebSocketReceiveResult result = await socket.ReceiveAsync(
            //        buffer, CancellationToken.None);
            //    if (socket.State == WebSocketState.Open)
            //    {
            //        string userMessage = Encoding.UTF8.GetString(
            //            buffer.Array, 0, result.Count);
            //        userMessage = "You sent: " + userMessage + " at " +
            //            DateTime.Now.ToLongTimeString();
            //        buffer = new ArraySegment<byte>(
            //            Encoding.UTF8.GetBytes(userMessage));
            //        await socket.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None);
            //    }
            //    else
            //    {
            //        break;
            //    }
            //}
        }

        public async Task OnOpen(WsConfSubscriber subscriber)
        {
            WsConfPubSubState confState;
            Boolean substate = false;
            if (!channels.TryGetValue(channelName, out confState))
            {
                //add from databse 
                confState = channels.GetOrAdd(channelName, new WsConfPubSubState(channelName));

            }
            substate = confState.AddSubscriber(subscriber);
            string sendLog = "{\"Message\":\"Success Connected\"}";
            ArraySegment<byte> welcomeBuffer = new ArraySegment<byte>(Encoding.UTF8.GetBytes(sendLog));
            Boolean gotSignal = false;
            try
            {
                gotSignal = subscriber.autoREvent.WaitOne();
                //await subscriber.subSocket.SendAsync(welcomeBuffer, WebSocketMessageType.Text, true, CancellationToken.None);
            }
            finally
            {
                if (gotSignal) subscriber.autoREvent.Set();
            }
        }
        public void OnClose(WsConfSubscriber subsciber, WebSocketCloseStatus status)
        {
            WsConfPubSubState confState;
            if (channels.TryGetValue(channelName, out confState))
            {
                confState.RemoveSubscriber(subsciber);
            }
        }
        public bool IsReusable
        {
            get { return false; }
        }
    }

}
    