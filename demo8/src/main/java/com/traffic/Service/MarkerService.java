package com.traffic.Service;

import com.traffic.Mapper.FetchData;
import com.traffic.pojo.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MarkerService {

    @Autowired
    private FetchData fetchData;
    public Marker[] getMarker() {
        return fetchData.POIList();
    }
}
