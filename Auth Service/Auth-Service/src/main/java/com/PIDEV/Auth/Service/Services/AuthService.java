package com.PIDEV.Auth.Service.Services;

import com.PIDEV.Auth.Service.Entity.Role;
import com.PIDEV.Auth.Service.Entity.User;
import com.PIDEV.Auth.Service.Repository.UserRepository;
import jakarta.ws.rs.core.Response;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Keycloak keycloak;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.auth-server-url}")
    private String keycloakServerUrl;

    @Value("${keycloak.resource}")
    private String clientId;

    @Value("${keycloak.credentials.secret}")
    private String clientSecret;

    @Transactional
    public User register(User user, String password) {
        UserRepresentation keycloakUser = new UserRepresentation();
        keycloakUser.setUsername(user.getEmail());
        keycloakUser.setEmail(user.getEmail());
        keycloakUser.setFirstName(user.getName());
        keycloakUser.setEnabled(true);

        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(password);
        credential.setTemporary(false);
        keycloakUser.setCredentials(Collections.singletonList(credential));

        Map<String, List<String>> attributes = new HashMap<>();
        attributes.put("phoneNumber", Collections.singletonList(user.getPhoneNumber()));
        attributes.put("address", Collections.singletonList(user.getAddress()));
        attributes.put("dateOfBirth", Collections.singletonList(user.getDateOfBirth().toString()));
        attributes.put("role", Collections.singletonList(user.getRole().name()));
        keycloakUser.setAttributes(attributes);

        UsersResource usersResource = keycloak.realm(realm).users();
        Response response = usersResource.create(keycloakUser);

        if (response.getStatus() != 201) {
            throw new RuntimeException("Failed to create user in Keycloak. Status: " + response.getStatus());
        }

        Optional<UserRepresentation> createdUserOpt = usersResource.search(user.getEmail()).stream().findFirst();

        if (createdUserOpt.isEmpty()) {
            throw new RuntimeException("Failed to retrieve the created user from Keycloak.");
        }

        String userId = createdUserOpt.get().getId();
        assignRoleToUser(userId, user.getRole());

        return userRepository.save(user);
    }

    private void assignRoleToUser(String userId, Role role) {
        RealmResource realmResource = keycloak.realm(realm);
        RoleRepresentation keycloakRole = realmResource.roles().get(role.name()).toRepresentation();
        realmResource.users().get(userId).roles().realmLevel().add(Collections.singletonList(keycloakRole));
    }

    public Map<String, Object> login(String email, String password) {
        String url = keycloakServerUrl + "/realms/" + realm + "/protocol/openid-connect/token";

        RestTemplate restTemplate = new RestTemplate();
        Map<String, String> request = new HashMap<>();
        request.put("grant_type", "password");
        request.put("client_id", clientId);
        request.put("client_secret", clientSecret);
        request.put("username", email);
        request.put("password", password);

        Map<String, Object> response = restTemplate.postForObject(url, request, Map.class);

        if (response == null || !response.containsKey("access_token")) {
            throw new RuntimeException("Invalid login credentials");
        }

        return response;
    }
}
