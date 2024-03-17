package com.homeapp.sensors;


import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api")
public class Dataloader implements CommandLineRunner {

    private final MetricsRepository metricRepo;
    private final RoomsRepository roomRepo;

    public Dataloader(MetricsRepository metricRepo, RoomsRepository roomRepo) {
        this.metricRepo = metricRepo;
        this.roomRepo = roomRepo;
    }

    @Override
    public void run(String... args) throws Exception {

    }

    @GetMapping("/metrics/roomsWithLatestMetric")
    public List<Metric> getLatestMetrics() {

        return getRoomNames().stream().map(room -> {
            final var metric = metricRepo.getMetricsByRoom(room).stream().findFirst();
            return metric.isEmpty() ? new Metric(room) : metric.get();
        }).toList();
    }

    @GetMapping("/{room}")
    public List<Metric> getRoomMetrics(@PathVariable String room) {
        return metricRepo.getMetricsByRoom(room).stream().limit(5).toList();
    }

    @GetMapping("/rooms")
    public List<Room> getRooms() {
        return roomRepo.findAll();
    }

    @PostMapping("/rooms/newRoom")
    public ResponseEntity<String> newRoom(@RequestBody Room newRoom) {
        System.out.println("New room received with name: " + newRoom.getName() + " and bluetoothName: " + newRoom.getBluetoothName());
        roomRepo.save(newRoom);
        return ResponseEntity.ok("Created");
    }

    @DeleteMapping("/rooms/{id}")
    public ResponseEntity<String> deleteRoom(@PathVariable String id){
        System.out.println("Going to delete room with ID: " + id);
        roomRepo.deleteById(id);
        return  ResponseEntity.ok("DELETED");
    }

    @PutMapping("/rooms/{id}")
    public ResponseEntity<Room> updateRoom(@PathVariable String id,  @RequestBody Room newRoom){
        System.out.println("Room with ID: " + id + "will be updated with: " + newRoom);
        final var roomFound = roomRepo.findById(id);

        if (roomFound.isPresent()){
            roomFound.get().setName(newRoom.getName());
            roomFound.get().setBluetoothName(newRoom.getBluetoothName());
            return ResponseEntity.ok(roomRepo.save(roomFound.get()));
        }
        else{
            return ResponseEntity.notFound().build();
        }

    }

    private List<String> getRoomNames() {
        return roomRepo.findAll().stream().map(Room::getName).toList();
    }

}
