package com.partnershipmanagement.Services;

import com.dropbox.sign.model.SignatureRequestGetResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.dropbox.sign.Configuration;
import com.dropbox.sign.api.EmbeddedApi;
import com.dropbox.sign.api.SignatureRequestApi;
import com.dropbox.sign.auth.HttpBasicAuth;
import com.dropbox.sign.model.*;
import org.springframework.core.env.Environment;

import java.util.List;

@Service
public class DropBoxSignService {
    @Autowired
    private Environment env;

    public String sendEmbeddedSignatureRequest() {
        try {
            String dsApiKey = env.getProperty("ds.api-key");
            String dsClientId = env.getProperty("ds.client-id");
            String dsTemplateId = env.getProperty("ds.template-id");
            String signerName = env.getProperty("signer.name");
            String signerEmail = env.getProperty("signer.email");
            String signerRole = env.getProperty("signer.role");

            // ✅ Debug print all key variables
            System.out.println("🔑 dsApiKey: " + dsApiKey);
            System.out.println("🆔 dsClientId: " + dsClientId);
            System.out.println("📄 dsTemplateId: " + dsTemplateId);
            System.out.println("📧 signerEmail: " + signerEmail);
            System.out.println("🧍 signerName: " + signerName);
            System.out.println("👤 signerRole: " + signerRole);

            var apiClient = Configuration.getDefaultApiClient();
            var apiKey = (HttpBasicAuth) apiClient.getAuthentication("api_key");
            apiKey.setUsername(dsApiKey);

            var signatureRequestApi = new SignatureRequestApi(apiClient);

            var signer = new SubSignatureRequestTemplateSigner()
                    .role(signerRole)
                    .name(signerName)
                    .emailAddress(signerEmail);

            var subSigningOption = new SubSigningOptions()
                    .draw(true)
                    .type(true)
                    .upload(true)
                    .phone(false)
                    .defaultType(SubSigningOptions.DefaultTypeEnum.DRAW);

            var data = new SignatureRequestCreateEmbeddedWithTemplateRequest()
                    .clientId(dsClientId)
                    .templateIds(List.of(dsTemplateId))
                    .signers(List.of(signer))
                    .signingOptions(subSigningOption)
                    .testMode(true);

            SignatureRequestGetResponse result = signatureRequestApi.signatureRequestCreateEmbeddedWithTemplate(data);

            String signatureId = result.getSignatureRequest().getSignatures().get(0).getSignatureId();
            System.out.println("🖊️ Signature ID: " + signatureId);  // <- Log it!

            var embeddedApi = new EmbeddedApi(apiClient);
            EmbeddedSignUrlResponse response = embeddedApi.embeddedSignUrl(signatureId);
            return response.getEmbedded().getSignUrl();

        } catch (Exception e) {
            System.out.println("❌ Error occurred in sendEmbeddedSignatureRequest:");
            e.printStackTrace();
            return "1";
        }
    }
}
