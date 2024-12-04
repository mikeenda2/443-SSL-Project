namespace API.Services
{
    public interface ISSLCertificateService
    {
        Task<string> GetSSLCertificateDetailsAsync(string url);
    }
}
