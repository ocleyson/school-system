import React, { Component } from "react";
import Chart from "react-apexcharts";
import {DivMain, DivScrollElement, DivMainChart, H1TitleChart, DivChartHeader, DivScroll} from './style';

class Charts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mainChart: {
        options: {
          xaxis: {
            categories: []
          }
        },
        series: [],
      },
      bgColor: '',
      periods: [],
      stateCustomHeight: 1,
    };
  }

  componentWillReceiveProps(nextProps) {
    var periodsModel = nextProps.periodsModel;

    this.changePeriod(periodsModel[0], nextProps.subjects, nextProps.studentsubjects);

    this.setState({periods: periodsModel});
  }

  changePeriod(periodObject, subjects, studentSubjectWithGrades) {
    
    var series = periodObject.gradesSchema.reduce((arraySeries, period) => {
      var arrayWithEachGrade = subjects.map(subject => {

        var subjectInStudent = studentSubjectWithGrades.filter(f => {
          return f.subjectId === subject.subjectId
        });
        
        var periodInStudentSubject = subjectInStudent.find(f => {
          return f.periodId === periodObject.periodId
        });

        if(periodInStudentSubject === undefined) {
          return 0
        } else {
          var schemaInSubjectStudent = periodInStudentSubject.grades.find(f => {
            return f.schemaId === period.schemaId
          });

          // when the grades hasnt the grades in periodModal return 0(zero)
          if(schemaInSubjectStudent) {
            return Number(schemaInSubjectStudent.value) || 0
          } else {
            return 0
          }
  
        }

      });

      arraySeries.push({
        name: `${period.name}`,
        data: arrayWithEachGrade
      });

      return arraySeries
    }, [])

    var subjectNames = subjects.map(subject => {
      return subject.subjectName;
    })

    this.setState({bgColor: periodObject.periodId, stateCustomHeight: subjects.length, mainChart: {
      options: {
        xaxis: {
          categories: subjectNames
        }
      },
      series: series,
    }});
  }

  render() {

    const {bgColor, mainChart, periods, stateCustomHeight} = this.state;
    const windowWidth = window.innerWidth;

    return (
      <DivMain className="app">
        <div className="row">
          <div className="mixed-chart" >

            {/*Buttons of the exists charts*/}

            <DivChartHeader>
              <H1TitleChart>Períodos</H1TitleChart>
            </DivChartHeader>

            <DivScroll>

              {/*Button chart Div*/}

              <ul>

                {periods.map((item) => (
                  <li key={item.periodId}>
                    <DivScrollElement bgcolor={bgColor === item.periodId} onClick={() => this.changePeriod(item, this.props.subjects, this.props.studentsubjects)}>
  
                      <h1>{item.periodName}</h1>
  
                    </DivScrollElement>
                  </li>
                ))}

              </ul>

            </DivScroll>

            {/*Div where the chart is*/}

            <DivMainChart className="mainchart" customHeight={stateCustomHeight*200}>
              
              <Chart
                options={{plotOptions: {
                  bar: {
                    horizontal: windowWidth <= 800 ? true : false,
                  }
                },
                dataLabels: {
                  enabled: true
                }, ...mainChart.options}}
                series={mainChart.series}
                type='bar'
                width='100%'
                height='100%'
                className="divchart"
              />

            </DivMainChart>
          </div>
        </div>
      </DivMain>
    );
  }
}

export default Charts;