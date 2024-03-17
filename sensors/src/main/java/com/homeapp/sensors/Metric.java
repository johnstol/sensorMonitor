package com.homeapp.sensors;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tempData")
public class Metric {

    @Id
    private String id;
    private Date timestamp;
    private String room;
    private Integer humidity;
    private Integer temperature;
    private Integer battery;

    public Metric(String room){
        this.room=room;
        this.battery=null;
        this.humidity=null;
        this.temperature=null;
        this.timestamp=null;
    }
}
