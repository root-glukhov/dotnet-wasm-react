using System;
using System.IO;
using System.IO.Compression;
using System.Net.Http;
using System.Runtime.InteropServices.JavaScript;
using System.Threading.Tasks;

#pragma warning disable CA1416 


public partial class MainApp
{
	public static void Main(string[] args) { }


    [JSExport]
    internal static byte[] GzipCompress(byte[] data)
	{
		try
		{
			using var compressedStream = new MemoryStream();
			using (var gzipStream = new GZipStream(compressedStream, CompressionMode.Compress))
			{
				gzipStream.Write(data);
			}

			return compressedStream.ToArray();
		}
		catch (Exception e)
		{
			Console.WriteLine(e.ToString());
		}

		return Array.Empty<byte>();
	}

	[JSExport]
	internal static async Task<string> TestFuncAsync() {
		HttpClient client = new HttpClient();
		string uri = "https://httpbin.org/anything";
		string responseText = await client.GetStringAsync(uri);

		return responseText;
	}
}