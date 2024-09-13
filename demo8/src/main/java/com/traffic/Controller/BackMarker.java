package com.traffic.Controller;

import com.traffic.Service.MarkerService;
import com.traffic.pojo.Marker;
import com.traffic.pojo.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
public class BackMarker {

    @Autowired
    private MarkerService markerService;

    @GetMapping("/MarkerList")
    public Result backMarkerData(){
        Marker[] data= markerService.getMarker();
        return Result.success(data);
    }
}
