import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import api from "./services/api";

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get("/repositories").then((response) => {
      setRepositories(response.data);
    });
  }, []);

  async function handleAddRepository() {
    const response = await api.post('/repositories', {
      title: `New repo ${Date.now()}`,
      url: 'https://github.com/vitormil',
      techs: [],
    })

    const repository = response.data

    setRepositories([ ...repositories, repository ])
  }

  async function handleRepositoryLike(id) {
    const response = await api.post(`/repositories/${id}/like`);

    const updatedRepo = response.data;

    const newRepos = repositories.map(repository => (
      repository.id === updatedRepo.id ? updatedRepo : repository
    ))

    setRepositories(newRepos);
  }  

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <Text style={styles.pageTitle}>Repositories</Text>
        <FlatList
          data={repositories}
          keyExtractor={repository => repository.id}
          renderItem={({ item: repository }) => (
            <View style={styles.repositoryOuter}>
              <View style={styles.repositoryBox}>
                <Text style={styles.title}>{repository.title}</Text>
                <Text style={styles.url}>{repository.url}</Text>
                <View style={styles.techContainer}>
                  {repository.techs.map(tech => <Text key={tech} style={styles.tech}>{tech}</Text>)}
                </View>
                <Text
                  testID={`repository-likes-${repository.id}`}
                  style={styles.likes}
                >
                    {repository.likes} curtida{repository.likes == 0 || repository.likes > 1 ? 's' : null}
                </Text>
              </View>
              <TouchableOpacity
                testID={`like-button-${repository.id}`}
                activeOpacity={0.6}
                style={styles.curtirButton}
                onPress={() => handleRepositoryLike(repository.id)}
              >
                <Text style={styles.curtirButtonText}>Curtir</Text>
              </TouchableOpacity>
            </View>
        )}
        />
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.button}
          onPress={handleAddRepository}
        >
          <Text style={styles.buttonText}>Adicionar repositório</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7159c1',
  },

  pageTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 10,
    color: '#fff',
  },

  repositoryOuter: {
    borderRadius: 5,
    borderColor: '#6550ad',
    backgroundColor: '#fff',
    borderWidth: 2,
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
  },

  repositoryBox: {
    flex: 1,
    padding: 15,
  },

  likes: {
    color: '#7159c1',
    fontSize: 10,
  },

  title: {
    color: '#7159c1',
    fontSize: 16,
    fontWeight: 'bold',
  },

  url: {
    color: '#555',
    fontSize: 10,
    marginBottom: 7,
  },

  techContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  tech: {
    flexWrap: 'wrap',
    borderWidth: 1,
    borderColor: '#6550ad',
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: '#f0eef8',
    color: '#2d234d',
    marginRight: 5,
    marginBottom: 5,
    fontWeight: 'normal',
    fontSize: 10,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },

  button: {
    alignSelf: 'stretch',
    backgroundColor: '#699638',
    borderWidth: 1,
    borderColor: '#8fc159',
    margin: 20,
    height: 50,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#fff',
  },

  curtirButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#eee',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },

  curtirButtonText: {
    color: '#6550ad',
  },

});
