package project_z.demo.security;

import java.security.Key;
import java.util.UUID;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import project_z.demo.enums.UserRole;

@Service
public interface JwtService {
    String generateToken(UserDetails user);

    boolean validateToken(String token);

    UUID extractUsername(String token);

    Key getSigningKey(String token);

    UserRole extractRole(UUID userId);

    UserRole getCurrentUserRole();
}
