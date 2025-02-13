package tn.esprit.gestionpfe;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pfe")
public class PfeRestAPI {

    private String hello = "Hello, I'm the Pfe MS";

    @RequestMapping("/helloPfe")
    public String sayHello() {
        return hello;
    }

    @Autowired
    private PfeService pfeService;

    @GetMapping
    public ResponseEntity<List<Pfe>> getAll() {
        return new ResponseEntity<>(pfeService.getAllPfe(), HttpStatus.OK);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Pfe> createPfe(@RequestBody Pfe pfe) {
        return new ResponseEntity<>(pfeService.createPfe(pfe), HttpStatus.CREATED);
    }

    @DeleteMapping(value = "/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<String> deletePfe(@PathVariable(value = "id") Long id) {
        return new ResponseEntity<>(pfeService.deletePfe(id), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pfe> getPfeById(@PathVariable Long id) {
        return pfeService.getPfeById(id)
                .map(pfe -> new ResponseEntity<>(pfe, HttpStatus.FOUND))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping(value = "/update/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<Pfe> updatePfe(@PathVariable Long id, @RequestBody Pfe updatedPfe) {
        return new ResponseEntity<>(pfeService.updatePfe(id, updatedPfe), HttpStatus.OK);
    }
}
