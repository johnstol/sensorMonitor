package com.homeapp.sensors;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;



/**
 * MetricsRepository
 */
public interface MetricsRepository extends MongoRepository<Metric, String> {

    @Query(value="{room:?0}",sort="{'timestamp' : -1}")
    List<Metric> getMetricsByRoom(String room);

}