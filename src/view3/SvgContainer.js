export default function Component({svgData, groupIndex, mouseData}) {
  const getD = (svgObj) => {
    let cx0 = svgObj.x0 + 50;
    let cy0 = svgObj.y0;
    let cx1 = svgObj.x1 - 50;
    let cy1 = svgObj.y1;

    let dx = (svgObj.x1 - svgObj.x0) / 300; // x거리가 큰 만큼 곡선을 크게
    if (svgObj.y0 >= svgObj.y1) {
      cy0 += 20 * dx;
      cy1 -= 20 * dx;
    } else {
      cy0 -= 20 * dx;
      cy1 += 20 * dx;
    }
    
    return `M ${svgObj.x0} ${svgObj.y0} C ${cx0} ${cy0} ${cx1} ${cy1} ${svgObj.x1} ${svgObj.y1}`;
  }
  return (
    <svg>
      {/* <path d="M 10 75 Q 50 10 100 75 T 190 75" stroke="black" stroke-linecap="round" stroke-dasharray="5,10,5" fill="none"/> */}
      {/* <path d="M 10 10, 50 50" stroke="green" strokeWidth="3" strokeLinecap="round" strokeDasharray="5,10,5" fill="green" /> */}
      {
        svgData && svgData[groupIndex] && svgData[groupIndex].map((svgTask, taskIndex) => {
          return svgTask.map((svgObj, index3) => {
            return <path key={index3} d={getD(svgObj)}
                stroke="currentColor" fill="none" strokeDasharray="none" strokeWidth="1" style={{color: mouseData?.groupIndex === groupIndex && mouseData?.taskIndex === taskIndex ? 'blue' : 'green'}}
              />
          })
        })
      }
    </svg>
  )
}
