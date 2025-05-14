package com.partnershipmanagement.Controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dropbox.sign.EventCallbackHelper;
import com.dropbox.sign.model.EventCallbackRequest;
import com.dropbox.sign.model.EventCallbackRequestEvent;
import com.partnershipmanagement.Services.DropBoxSignService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api")
public class DropBoxSignController {
    private final Logger logger = LoggerFactory.getLogger(DropBoxSignService.class);

    @Autowired
    private Environment env;

    @Autowired
    DropBoxSignService dropBoxSignService;

    @PostMapping("/sign/embeddedSing")
    public String  embeddedSignSignatureRequest(){
        return dropBoxSignService.sendEmbeddedSignatureRequest();
    }

    @PostMapping( value = "/sign/webhook")
    public String webHook(@RequestParam String json) throws Exception {
        var callBackEvent = EventCallbackRequest.init(json);

        String dsApiKey = env.getProperty("DS_API_KEY");

        boolean validRequest = EventCallbackHelper.isValid(dsApiKey, callBackEvent);
        EventCallbackRequestEvent eventPayload = callBackEvent.getEvent();

        if (validRequest) {
            switch (eventPayload.getEventType().toString()) {
                case "callback_test":
                    logger.info("callback test payload recieved");
                    logger.info(eventPayload.toString());
                    break;
                case "signature_request_sent":
                    logger.info("signature request sent");
                    break;
                case "signature_request_viewed":
                    logger.info("signature request was viewed");
                    break;
                case "signature_requet_signed":
                    logger.info("signature request was signed");
                case "signature_request_all_signed":
                    logger.info("signature request was signed by all parties");
                    break;
                case "signature_request_downloadable":
                    logger.info("signature can be downloaded");
                default:
                    logger.info("DS event occured : " + eventPayload.getEventType());
                    break;
            }
        }
        return "Hello API Event recieved";
    }
}
