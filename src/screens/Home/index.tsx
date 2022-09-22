import React, { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { Header } from '../../components/Header';
import { SearchBar } from '../../components/SearchBar';
import { LoginDataItem } from '../../components/LoginDataItem';

import {
  Container,
  Metadata,
  Title,
  TotalPassCount,
  LoginList  
} from './styles';
import { View } from 'react-native';

interface LoginDataProps {
  id: string;
  service_name: string;
  email: string;
  password: string;
};

type LoginListDataProps = LoginDataProps[];

export function Home() {
  const dados = [
    {
      id: '1',
      service_name: 'Rocketseat Prisco',
      email: 'priscocleyton@gmail.com',
      password: '123123',
    },
    {
      id: '2',
      service_name: 'Hotmail Prisco',
      email: 'priscocleyton@hotmail.com',
      password: '123456789',
    },
    {
      id: '3',
      service_name: 'Hotmail Henrique',
      email: 'henrique@hotmail.com',
      password: '123456',
    },

  ]

  const [searchText, setSearchText] = useState('');
  const [searchListData, setSearchListData] = useState<LoginListDataProps>([]);
  const [data, setData] = useState<LoginListDataProps>(dados);

  async function loadData() {
    const dataKey = '@savepass:logins';
    // Get asyncStorage data, use setSearchListData and setData
    const data = await AsyncStorage.getItem(dataKey);
    if (data) {
      setData(JSON.parse(data))
      setSearchListData(JSON.parse(data))
    }            
  }

  function handleFilterLoginData() {
    // Filter results inside data, save with setSearchListData    
    if (!searchText)
      return;

    const foundItem = searchListData.find(item => {
      if (item.service_name.includes(searchText)){ 
        return item;
      }             
    });
      
    if (foundItem)
      setSearchListData([foundItem])
    
    

  }

  function handleChangeInputText(text: string) {
    // Update searchText value
    if (text === '') {
      setSearchListData(data)
      setSearchText(text)
    } else {
      setSearchText(text)
    }
  }

  useFocusEffect(useCallback(() => {
    // alert('remover 1')
    // setData(dados)
    // setSearchListData(dados)

    loadData();
  }, []));

  return (
    <>
      <Header
        user={{
          name: 'Rocketseat',
          avatar_url: 'https://i.ibb.co/ZmFHZDM/rocketseat.jpg'
        }}
      />
      <Container>
        <SearchBar
          placeholder="Qual senha você procura?"
          onChangeText={handleChangeInputText}
          value={searchText}
          returnKeyType="search"
          onSubmitEditing={handleFilterLoginData}

          onSearchButtonPress={handleFilterLoginData}
        />

        <Metadata>
          <Title>Suas senhas</Title>
          <TotalPassCount>
            {searchListData.length
              ? `${`${searchListData.length}`.padStart(2, '0')} ao total`
              : 'Nada a ser exibido'
            }
          </TotalPassCount>
        </Metadata>

        <LoginList
          keyExtractor={(item) => item.id}
          data={searchListData}
          renderItem={({ item: loginData }) => {
            return <LoginDataItem
              service_name={loginData.service_name}
              email={loginData.email}
              password={loginData.password}
            />
          }}
        />
      </Container>
    </>
  )
}