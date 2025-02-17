package tn.esprit.esponline.Controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.esponline.DAO.entities.User;
import tn.esprit.esponline.Services.IUserService;

import java.util.List;

@Tag(name = "Users", description = "This web service handles CRUD operations for users.")
@RestController
@RequestMapping("/users")
public class UserRestController {

    @Autowired
    private IUserService userService;

    @Operation(summary = "Retrieve all users", description = "This endpoint retrieves all users from the database.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved all users"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @Operation(summary = "Add a new user", description = "This endpoint adds a new user to the database.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Successfully added user"),
            @ApiResponse(responseCode = "400", description = "Invalid user data")
    })
    @PostMapping("/add")
    public User addUser(@RequestBody User user) {
        return userService.addUser(user);
    }

    @Operation(summary = "Update user email", description = "This endpoint updates the email of a user by their ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully updated user email"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "400", description = "Invalid email format")
    })
    @PutMapping("/updateEmail/{id}")
    public void updateEmail(@PathVariable int id, @RequestParam String email) {
        userService.updateUserEmail(id, email);
    }

    @Operation(summary = "Delete a user", description = "This endpoint deletes a user by their ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Successfully deleted user"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @DeleteMapping("/delete/{id}")
    public void deleteUser(@PathVariable int id) {
        userService.deleteUserById(id);
    }

    @Operation(summary = "Retrieve users by role", description = "This endpoint retrieves users based on their role.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved users by role"),
            @ApiResponse(responseCode = "404", description = "No users found with the specified role")
    })
    @GetMapping("/role/{role}")
    public List<User> getUsersByRole(@PathVariable String role) {
        return userService.getUsersByRole(role);
    }
}
