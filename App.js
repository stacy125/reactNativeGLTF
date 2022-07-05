import { Canvas } from '@react-three/fiber'
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Expo from 'expo';
import ExpoTHREE, { Renderer } from "expo-three";
import { GLView } from 'expo-gl';
import { Scene, Mesh, MeshBasicMaterial, PerspectiveCamera, BoxBufferGeometry } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import usePromise from "react-promise-suspense";
import { Asset } from "expo-asset";
// import femaleDancer from './assets/femaleDancer.glb';

const App = () => {


  // Create an Asset from a resource


  // await asset.downloadAsync();

  // This is the local URI
  // const uri = asset.localUri;
  const getUrl = async () => {
    const asset = Asset.fromModule(require('./assets/femaleDancer.glb'));
    await asset.downloadAsync();

    return asset.localUri;
  };

  useEffect(async () => {
    const url = await getUrl();
    console.log(url, 'url');
  }, [])


  // const url = usePromise(getUrl, []);
  // const { nodes } = useLoader(GLTFLoader,  url);

  const onContextCreate = async (gl) => {
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);
    const geometry = new BoxBufferGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({ color: 'blue' });
    const cube = new Mesh(geometry, material);
    scene.add(cube);

    let loadedModel;
    const loader = new GLTFLoader();
    loader.load('./assets/femaleDancer.glb', function (glb) {
      loadedModel = glb
      console.log(glb);
      glb.scene.rotation.y = Math.PI / 8;
      glb.scene.position.y = 3;
      glb.scene.scale.set(10, 10, 10);
      scene.add(glb.scene)
      // .scale.set(0.3, 0.3, 0.3);

      //   render();

      // },
      // called while loading is progressing
      //   function (xhr) {

      //     console.log((xhr.loaded / xhr.total * 100) + '% loaded');

      //   }, undefined, function (error) {
      //   console.error(error);
    });

    camera.position.z = 10;

    const animate = () => {
      if (loadedModel) {
        loadedModel.scene.rotation.x += 0.01;
        loadedModel.scene.rotation.y += 0.01;
        loadedModel.scene.rotation.z += 0.01;
      }
      requestAnimationFrame(animate);
    };
    animate();


    const render = () => {

      requestAnimationFrame(render);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
      gl.endFrameEXP();
    }
    render();
  }

  return (
    <View style={{ flex: 1, margin: 100 }}>
      <Text>Hello</Text>
      <GLView
        onContextCreate={onContextCreate}
        style={{ flex: 1, width: 400, height: 400 }}
      />
    </View>
  )
}

export default App
