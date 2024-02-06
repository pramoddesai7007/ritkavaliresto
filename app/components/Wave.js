'use client'
import React from "react";
import Chart from "react-apexcharts";


function Wave() {
    return (
        <React.Fragment
        >
            <div className="container-fluid rounded-md">
                <Chart
                    type="area"
                    width={750}
                    height={300}

                    series={[
                        {
                            name: "sale",
                            data: [345, 27, 121, 676, 98, 321,88,986,200,5,90]
                        },
                        {
                            name: "Expenses",
                            data: [80,355,40,97,45,156,80,321,845,109,20,80]
                        }
                    ]}
                    options={{
                        title:{
                            text:"Financial",
                            style:{fontSize:20}
                        },

                        // colors:['#f90000'],
                        stroke:{width:1, curve:'smooth'},
                        xaxis:{
                            title:{ text:"",
                            style:{ fontSize:20}
                        },

                        categories:[2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016]
                        },

                        yaxis:{
                            title:{
                                // text:"No of commits",
                                style:{ fontSize:20}
                            }
                        }
                    }}
                >
                </Chart>
            </div>
        </React.Fragment>
    );
}
export default Wave;