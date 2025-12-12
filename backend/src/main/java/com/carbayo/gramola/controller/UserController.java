package com.carbayo.gramola.controller;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin; // ¡Asegúrate de importar esto!
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Value;
import com.carbayo.gramola.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @Value("${spotify.client.id}")
    private String spotifyClientId;

    @Value("${spotify.client.secret}")
    private String spotifyClientSecret;

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody Map<String, String> body) {
        String bar = body.get("bar");
        String email = body.get("email");
        String pwd1 = body.get("pwd1");
        String pwd2 = body.get("pwd2");
        // String clientId = body.get("clientId"); // Ya no se usa del body
        // String clientSecret = body.get("clientSecret"); // Ya no se usa del body

        // 1. Validaciones básicas
        if (!pwd1.equals(pwd2)) {
             // Devolvemos 406 si los datos no sirven (ej. contraseñas no coinciden) [cite: 112]
            return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
        }

        try {
            // 2. Llamada al servicio usando las variables de entorno
            this.userService.register(bar, email, pwd1, spotifyClientId, spotifyClientSecret);
            return new ResponseEntity<>(HttpStatus.OK); // 200 OK [cite: 112]
        } catch (Exception e) {
            // 409 si el usuario ya existe [cite: 112]
            return new ResponseEntity<>(HttpStatus.CONFLICT); 
        }
    }
	/*
	 * @GetMapping("/verify") public ResponseEntity<String>
	 * verifyUser(@Param("code") String code) { if (userService.verify(code)) {
	 * return ResponseEntity.ok("¡Verificación exitosa! Ya puedes iniciar sesión.");
	 * } else { return
	 * ResponseEntity.badRequest().body("Fallo en la verificación."); } }
	 */
    
    // ... deleteUser, etc.
}