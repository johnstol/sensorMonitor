package com.homeapp.sensors;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * RoomsRepository
 */
public interface RoomsRepository extends MongoRepository<Room, String> {

}