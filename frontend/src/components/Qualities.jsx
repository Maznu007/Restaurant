import React from 'react';
import { data } from '../restApi.json';

const Qualities = () => {
  return (
    <>
      <section className='qualities' id='qualities'>
        <div className="container">
          {data[0].ourQualities.map((element, index) => (
            <div className='card' key={element.id}>
              <div className="number">0{index + 1}</div>
              <p className='title'>{element.title}</p>
              <p className='description'>{element.description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Qualities;