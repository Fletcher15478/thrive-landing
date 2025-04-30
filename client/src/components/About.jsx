import React from 'react';
import '../App.css';
import Sidebar from './Sidebar';

function About() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div className="about-wrapper" style={{ marginLeft: '14rem', width: '100%' }}>
        <div className="about-left">
          <div className="about-left-content">
            <div>
              <div className="shadow">
                <div className="about-img">
                <img src="/images/profile-pic.png" alt="About" />
                </div>
              </div>
              <h2>Fletcher Hartsock</h2>
              <h3>Computer Science Student</h3>
            </div>
            <ul className="icons">
              
              <li><i className="fab fa-linkedin"></i></li>
              <li><i className="fab fa-instagram"></i></li>
            </ul>
          </div>
        </div>

        <div className="about-right">
          <h1>hi<span>!</span></h1>
          <h2>Here's who I am & what I do</h2>
          <div className="about-btns">
            <button className="btn btn-pink">Resume</button>
            <button className="btn btn-white">Projects</button>
          </div>
          <div className="about-para">
            <p>I’m passionate about fitness and helping others transform through data, discipline, and smart programming. This app is my way of blending code and coaching 💪.</p>
            <p>I love React, weightlifting, and optimizing everything. Let’s go!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
