for EXAMPLE in ./examples/*;
    do if [ -d $EXAMPLE ];
        then
            rm -rf $EXAMPLE/plugins/gatsby-source-api
            cp -r dist $EXAMPLE/plugins/gatsby-source-api;
            cp package.json $EXAMPLE/plugins/gatsby-source-api/
        fi;
done;
