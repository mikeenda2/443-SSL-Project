using System.Net.Security;
using System.Net.Sockets;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text.Json;

namespace API.Services
{
    public class SSLCertificateService : ISSLCertificateService
    {
        public async Task<string> GetSSLCertificateDetailsAsync(string url)
        {
            try
            {
                // Parse the provided URL to extract the domain name
                Uri uri = new Uri(url);
                string domain = uri.Host;

                // Establish a TCP connection to the specified domain on port 443 (HTTPS)
                using (TcpClient client = new TcpClient(domain, 443))
                using (SslStream sslStream = new SslStream(client.GetStream(), false, (sender, cert, chain, errors) => true))
                {
                    // Authenticate the SSL stream as a client to the server
                    await sslStream.AuthenticateAsClientAsync(domain);

                    // Check if the server provided a certificate
                    if (sslStream.RemoteCertificate == null)
                    {
                        return JsonSerializer.Serialize(new { Error = $"No certificate found for {url}." });
                    }

                    // Cast to X509Certificate2 for richer certificate details
                    X509Certificate2 cert2 = new X509Certificate2(sslStream.RemoteCertificate);

                    // Extract certificate details
                    string issuer = cert2.Issuer;
                    DateTime expirationDate = cert2.NotAfter;
                    string subject = cert2.Subject;

                    // Extract encryption type using SignatureAlgorithm.Oid and handle possible null
                    string encryptionType = cert2.SignatureAlgorithm?.FriendlyName ?? "Unknown";

                    // Extract key size using GetRSAPublicKey (for RSA certificates)
                    int encryptionSize = 0;
                    if (cert2.GetRSAPublicKey() is RSA rsa)
                    {
                        encryptionSize = rsa.KeySize;
                    }
                    else if (cert2.GetECDsaPublicKey() is ECDsa ecdsa)
                    {
                        encryptionSize = ecdsa.KeySize;
                    }

                    string encryptionSizeStr = encryptionSize > 0 ? $"{encryptionSize} bits" : "Unknown";
                    string thumbprint = cert2.Thumbprint;

                    // Calculate time remaining before the certificate expires
                    TimeSpan timeRemaining = expirationDate - DateTime.Now;
                    string timeRemainingStr = timeRemaining.TotalDays > 0 
                        ? $"{timeRemaining.TotalDays:F1} days remaining" 
                        : "Expired";

                    // Construct a response object with the collected details
                    var response = new
                    {
                        Issuer = issuer,
                        ExpirationDate = expirationDate,
                        Subject = subject,
                        EncryptionType = encryptionType,
                        EncryptionSize = encryptionSize > 0 ? $"{encryptionSize} bits" : "Unknown",
                        Fingerprint = thumbprint,
                        TimeRemaining = timeRemainingStr
                    };

                    // Serialize the response to JSON for easy consumption
                    return JsonSerializer.Serialize(response);
                }
            }
            catch (Exception ex)
            {
                // Return an error message as JSON if an exception occurs
                return JsonSerializer.Serialize(new { Error = $"Error retrieving certificate for {url}: {ex.Message}" });
            }
        }
    }
}